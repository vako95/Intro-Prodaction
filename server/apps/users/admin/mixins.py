"""
Миксины для красивого отображения данных в Django Admin
"""
from django.utils.html import format_html


class AdminMediaMixin:
    """Базовый миксин для подключения CSS и JS"""
    
    class Media:
        css = {
            'all': (
                'admin/css/index.css',
                'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css',
            )
        }
        js = (
            'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js',
            'admin/js/fancybox_init.js',
        )


class ImagePreviewMixin(AdminMediaMixin):
    """Миксин для отображения изображений"""
    
    def get_image_preview(self, image_url, size=50, caption=''):
        """Круглое превью изображения с fancybox"""
        if image_url:
            return format_html(
                '<a href="{}" data-fancybox="gallery" data-caption="{}">'
                '<img src="{}" alt="{}" '
                'style="'
                'width: {}px; height: {}px; '
                'border-radius: 50%; '
                'object-fit: cover; '
                'border: 2px solid #e0e0e0; '
                'box-shadow: 0 2px 4px rgba(0,0,0,0.1); '
                'cursor: pointer; '
                'transition: transform 0.2s;'
                '" '
                'onmouseover="this.style.transform=\'scale(1.1)\'" '
                'onmouseout="this.style.transform=\'scale(1)\'"/>'
                '</a>',
                image_url, caption, image_url, caption, size, size
            )
        return format_html(
            '<div style="'
            'width: {}px; height: {}px; '
            'border-radius: 50%; '
            'background: #f5f5f5; '
            'display: flex; '
            'align-items: center; '
            'justify-content: center; '
            'color: #999; '
            'font-size: 20px;'
            '">📷</div>',
            size, size
        )
    
    def get_image_detail(self, image_url, caption='', max_width=400):
        """Полноразмерное изображение для детального просмотра с fancybox"""
        if image_url:
            return format_html(
                '<a href="{}" data-fancybox="detail" data-caption="{}">'
                '<img src="{}" alt="{}" '
                'style="'
                'max-width: {}px; '
                'height: auto; '
                'border-radius: 8px; '
                'box-shadow: 0 4px 12px rgba(0,0,0,0.15); '
                'cursor: pointer; '
                'transition: transform 0.2s;'
                '" '
                'onmouseover="this.style.transform=\'scale(1.02)\'" '
                'onmouseout="this.style.transform=\'scale(1)\'" '
                'title="Click to zoom"/>'
                '</a>'
                '<p style="margin-top: 8px; color: #666; font-size: 12px;">Click to zoom</p>',
                image_url, caption, image_url, caption, max_width
            )
        return format_html('<span style="color: #999;">No image</span>')


class StatusBadgeMixin(AdminMediaMixin):
    """Миксин для отображения статусов"""
    
    STATUS_COLORS = {
        'active': '#4CAF50',
        'inactive': '#9E9E9E',
        'pending': '#FF9800',
        'confirmed': '#2196F3',
        'cancelled': '#F44336',
        'completed': '#4CAF50',
        'paid': '#4CAF50',
        'failed': '#F44336',
        'refunded': '#9C27B0',
    }
    
    def get_status_badge(self, status, label=None):
        """Цветной бейдж для статуса"""
        if label is None:
            label = status
        color = self.STATUS_COLORS.get(status.lower(), '#757575')
        return format_html(
            '<span style="'
            'display: inline-block; '
            'padding: 4px 12px; '
            'border-radius: 12px; '
            'background: {}; '
            'color: white; '
            'font-size: 11px; '
            'font-weight: 600; '
            'text-transform: uppercase; '
            'letter-spacing: 0.5px;'
            '">{}</span>',
            color, label
        )
    
    def get_boolean_badge(self, value, true_label='Yes', false_label='No'):
        """Бейдж для boolean значений"""
        if value:
            return self.get_status_badge('active', true_label)
        return self.get_status_badge('inactive', false_label)


class PriceMixin(AdminMediaMixin):
    """Миксин для отображения цен"""
    
    def get_price_display(self, amount, currency='$', color='#4CAF50'):
        """Красивое отображение цены"""
        return format_html(
            '<span style="color: {}; font-weight: 600; font-size: 14px;">{}{}</span>',
            color, currency, amount
        )
    
    def get_discount_badge(self, discount):
        """Бейдж скидки"""
        if discount and discount > 0:
            return format_html(
                '<span style="'
                'background: #FF5722; '
                'color: white; '
                'padding: 3px 8px; '
                'border-radius: 4px; '
                'font-weight: 600; '
                'font-size: 11px;'
                '">-{}%</span>',
                discount
            )
        return format_html('<span style="color: #999; font-size: 12px;">—</span>')


class EmailMixin(AdminMediaMixin):
    """Миксин для отображения email"""
    
    def get_email_display(self, email):
        """Красивое отображение email"""
        if email:
            return format_html(
                '<a href="mailto:{}" style="'
                'color: #1976D2; '
                'text-decoration: none; '
                'font-weight: 500;'
                '">{}</a>',
                email, email
            )
        return format_html('<span style="color: #999;">—</span>')


class LinkMixin(AdminMediaMixin):
    """Миксин для отображения ссылок"""
    
    def get_admin_link(self, obj, app_label, model_name, text=None):
        """Ссылка на объект в админке"""
        if obj:
            if text is None:
                text = str(obj)
            return format_html(
                '<a href="/admin/{}/{}/{}/change/" style="'
                'color: #1976D2; '
                'text-decoration: none; '
                'font-weight: 500;'
                '">{}</a>',
                app_label, model_name, obj.id, text
            )
        return format_html('<span style="color: #999;">—</span>')
