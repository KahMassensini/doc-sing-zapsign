from django.contrib import admin
from .models import Signer

@admin.register(Signer)
class SignerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'document', 'status')
    list_filter = ('status', 'document')