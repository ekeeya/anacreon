from django.apps import AppConfig


class AnacreonConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'gluon.anacreon'

    def ready(self):
        import gluon.anacreon.signals
