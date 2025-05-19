
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

const TransactionModal = ({ isOpen, onClose, orderNumber }: TransactionModalProps) => {
  const [packageId, setPackageId] = useState('');
  const [sourceShelf, setSourceShelf] = useState('');
  const [destinationShelf, setDestinationShelf] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    // Validação básica
    if (!packageId || !sourceShelf || !destinationShelf) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    // Aqui processaríamos os dados do formulário
    toast({
      title: "Sucesso",
      description: `Transação da ordem #${orderNumber} registrada com sucesso`
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transação de Produto</DialogTitle>
          <DialogDescription>
            Ordem #{orderNumber} - Registre os detalhes da movimentação
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="package-id">ID do Pacote *</Label>
            <Input
              id="package-id"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              placeholder="Digite o ID do pacote"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-shelf">Prateleira de Origem *</Label>
            <Input
              id="source-shelf"
              value={sourceShelf}
              onChange={(e) => setSourceShelf(e.target.value)}
              placeholder="Digite o ID da prateleira de origem"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination-shelf">Prateleira de Destino *</Label>
            <Input
              id="destination-shelf"
              value={destinationShelf}
              onChange={(e) => setDestinationShelf(e.target.value)}
              placeholder="Digite o ID da prateleira de destino"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar Transação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
