from django.db import models
from documents.models import Document

class Signer(models.Model):
    
    document = models.ForeignKey('documents.Document', on_delete=models.CASCADE, related_name='signers' )
    
    token = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    external_id = models.CharField(max_length=255, null=True, blank=True)
