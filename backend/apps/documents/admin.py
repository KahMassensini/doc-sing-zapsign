from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'status', 'created_at')
    list_filter = ('status', 'company')