from django.db import models
from companies.models import Company

class Document(models.Model):
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='documents')
    
    open_id = models.IntegerField(null=True, blank=True)
    token = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    external_id = models.CharField(max_length=255, null=True, blank=True)
    created_by = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
