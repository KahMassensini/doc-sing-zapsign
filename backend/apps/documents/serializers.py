from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            'id',
            'company',
            'open_id',
            'token',
            'name',
            'status',
            'external_id',
            'created_by',
            'created_at',
            'last_updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'last_updated_at']


class DocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            'company',
            'open_id',
            'token',
            'name',
            'status',
            'external_id',
            'created_by',
        ]