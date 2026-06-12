import stripe
from django.conf import settings
from decimal import Decimal
import uuid
import time

# Инициализация Stripe
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '')

# Режим тестирования без реальных ключей
USE_FAKE_STRIPE = getattr(settings, 'USE_FAKE_STRIPE', False) or (
    not stripe.api_key or 
    stripe.api_key == '' or 
    'your_secret_key_here' in stripe.api_key
)


class FakeStripeService:
    """Фейковый Stripe сервис для тестирования без реальных ключей"""
    
    @staticmethod
    def create_payment_intent(amount, currency='usd', metadata=None):
        """Создать фейковый Payment Intent"""
        print(f"[FAKE STRIPE] Creating payment intent: amount={amount}, currency={currency}")
        
        # Генерируем фейковые ID
        payment_intent_id = f"pi_fake_{uuid.uuid4().hex[:24]}"
        client_secret = f"{payment_intent_id}_secret_{uuid.uuid4().hex[:16]}"
        
        return {
            'success': True,
            'payment_intent': {
                'id': payment_intent_id,
                'amount': int(Decimal(str(amount)) * 100),
                'currency': currency,
                'status': 'requires_payment_method',
                'metadata': metadata or {},
            },
            'client_secret': client_secret,
            'payment_intent_id': payment_intent_id,
        }
    
    @staticmethod
    def retrieve_payment_intent(payment_intent_id):
        """Получить фейковый Payment Intent"""
        print(f"[FAKE STRIPE] Retrieving payment intent: {payment_intent_id}")
        
        return {
            'success': True,
            'payment_intent': {
                'id': payment_intent_id,
                'status': 'succeeded',
            },
        }
    
    @staticmethod
    def get_payment_status(payment_intent_id):
        """Получить статус фейкового платежа"""
        print(f"[FAKE STRIPE] Getting payment status: {payment_intent_id}")
        
        # Всегда возвращаем успешный статус для тестирования
        return {
            'success': True,
            'status': 'succeeded',
            'amount': 100.00,
            'currency': 'usd',
        }


class StripeService:
    """Сервис для работы со Stripe"""
    
    @staticmethod
    def create_payment_intent(amount, currency='usd', metadata=None):
        """
        Создать Payment Intent
        
        Args:
            amount: Сумма в центах (для USD)
            currency: Валюта (по умолчанию USD)
            metadata: Дополнительные данные
        
        Returns:
            Payment Intent object
        """
        # Используем фейковый сервис если ключи не настроены
        if USE_FAKE_STRIPE:
            print("[STRIPE] Using FAKE Stripe service for testing")
            return FakeStripeService.create_payment_intent(amount, currency, metadata)
        
        try:
            # Конвертируем в центы
            amount_cents = int(Decimal(str(amount)) * 100)
            
            print(f"Creating Stripe Payment Intent: amount={amount_cents} cents, currency={currency}")
            
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            
            print(f"Payment Intent created successfully: {intent.id}")
            
            return {
                'success': True,
                'payment_intent': intent,
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id,
            }
        except stripe.error.AuthenticationError as e:
            print(f"Stripe Authentication Error: {str(e)}")
            return {
                'success': False,
                'error': f'Invalid Stripe API key. Please configure valid Stripe keys in settings.py. Error: {str(e)}',
            }
        except stripe.error.StripeError as e:
            print(f"Stripe Error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
            }
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}',
            }
    
    @staticmethod
    def retrieve_payment_intent(payment_intent_id):
        """
        Получить Payment Intent по ID
        
        Args:
            payment_intent_id: ID Payment Intent
        
        Returns:
            Payment Intent object или None
        """
        # Используем фейковый сервис если ключи не настроены
        if USE_FAKE_STRIPE:
            return FakeStripeService.retrieve_payment_intent(payment_intent_id)
        
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return {
                'success': True,
                'payment_intent': intent,
            }
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
            }
    
    @staticmethod
    def confirm_payment_intent(payment_intent_id):
        """
        Подтвердить Payment Intent
        
        Args:
            payment_intent_id: ID Payment Intent
        
        Returns:
            Payment Intent object
        """
        # Используем фейковый сервис если ключи не настроены
        if USE_FAKE_STRIPE:
            return FakeStripeService.retrieve_payment_intent(payment_intent_id)
        
        try:
            intent = stripe.PaymentIntent.confirm(payment_intent_id)
            return {
                'success': True,
                'payment_intent': intent,
            }
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
            }
    
    @staticmethod
    def cancel_payment_intent(payment_intent_id):
        """
        Отменить Payment Intent
        
        Args:
            payment_intent_id: ID Payment Intent
        
        Returns:
            Payment Intent object
        """
        if USE_FAKE_STRIPE:
            return {'success': True, 'payment_intent': {'id': payment_intent_id, 'status': 'canceled'}}
        
        try:
            intent = stripe.PaymentIntent.cancel(payment_intent_id)
            return {
                'success': True,
                'payment_intent': intent,
            }
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
            }
    
    @staticmethod
    def create_refund(payment_intent_id, amount=None):
        """
        Создать возврат
        
        Args:
            payment_intent_id: ID Payment Intent
            amount: Сумма возврата в центах (None = полный возврат)
        
        Returns:
            Refund object
        """
        if USE_FAKE_STRIPE:
            return {'success': True, 'refund': {'id': f'refund_fake_{uuid.uuid4().hex[:16]}'}}
        
        try:
            refund_data = {
                'payment_intent': payment_intent_id,
            }
            
            if amount:
                refund_data['amount'] = int(Decimal(str(amount)) * 100)
            
            refund = stripe.Refund.create(**refund_data)
            
            return {
                'success': True,
                'refund': refund,
            }
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
            }
    
    @staticmethod
    def get_payment_status(payment_intent_id):
        """
        Получить статус платежа
        
        Args:
            payment_intent_id: ID Payment Intent
        
        Returns:
            Статус платежа
        """
        # Используем фейковый сервис если ключи не настроены
        if USE_FAKE_STRIPE:
            return FakeStripeService.get_payment_status(payment_intent_id)
        
        result = StripeService.retrieve_payment_intent(payment_intent_id)
        
        if result['success']:
            intent = result['payment_intent']
            return {
                'success': True,
                'status': intent.status,
                'amount': intent.amount / 100,  # Конвертируем из центов
                'currency': intent.currency,
            }
        
        return result
