// Инициализация Fancybox для админки Django
(function() {
    'use strict';
    
    // Ждем загрузки DOM и Fancybox
    function initFancybox() {
        if (typeof Fancybox !== 'undefined') {
            // Инициализируем Fancybox для всех элементов с data-fancybox
            Fancybox.bind("[data-fancybox]", {
                // Настройки
                Toolbar: {
                    display: {
                        left: ["infobar"],
                        middle: [],
                        right: ["close"],
                    },
                },
                Images: {
                    zoom: true,
                },
                Thumbs: {
                    autoStart: false,
                },
            });
            
            console.log('Fancybox initialized successfully');
        } else {
            console.error('Fancybox library not loaded');
        }
    }
    
    // Инициализация при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Даем время на загрузку Fancybox библиотеки
            setTimeout(initFancybox, 500);
        });
    } else {
        setTimeout(initFancybox, 500);
    }
    
    // Переинициализация при динамическом добавлении контента (для inline форм)
    if (typeof django !== 'undefined' && django.jQuery) {
        django.jQuery(document).on('formset:added', function() {
            setTimeout(initFancybox, 100);
        });
    }
})();
