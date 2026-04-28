from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255)
    api_token = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'companies'  # ISSO AQUI força o Django a aceitar o modelo

    def __str__(self):
        return self.name