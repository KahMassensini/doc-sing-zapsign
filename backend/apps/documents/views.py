from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Document
from .serializers import DocumentSerializer, DocumentCreateSerializer
from services.zapsign_service import ZapSignService


class DocumentViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):

    queryset = Document.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentCreateSerializer
        return DocumentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        document = serializer.save()
        
        try:
            zapsign_service = ZapSignService()
            
            file_path = request.data.get('file_path')
            if file_path:
                zapsign_response = zapsign_service.create_document(
                    file_path=file_path,
                    doc_name=document.name
                )
                
                if zapsign_response and zapsign_response.get('token'):
                    document.token = zapsign_response.get('token')
                    document.open_id = zapsign_response.get('open_id')
                    document.external_id = zapsign_response.get('pk')
                    document.save()
                    
        except Exception as e:
            
            print(f"Erro ao enviar para ZapSign: {str(e)}")
        
        output_serializer = DocumentSerializer(document)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
