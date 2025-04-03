
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPermissionModule, UserPermissionAction } from "@/types/auth";

export interface UserPermission {
  module: UserPermissionModule;
  read: boolean;
  write: boolean;
}

interface UserPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  initialPermissions?: UserPermission[];
  onSave: (permissions: UserPermission[]) => void;
}

const defaultModules: UserPermissionModule[] = [
  'USUARIO',
  'ARMAZEM',
  'INVENTARIO',
  'RELATORIO'
];

const UserPermissionsModal = ({
  open,
  onOpenChange,
  userName,
  initialPermissions,
  onSave
}: UserPermissionsModalProps) => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);

  useEffect(() => {
    if (open) {
      // Initialize permissions with defaults or provided data
      if (initialPermissions && initialPermissions.length > 0) {
        setPermissions(initialPermissions);
      } else {
        setPermissions(defaultModules.map(module => ({
          module,
          read: false,
          write: false
        })));
      }
    }
  }, [open, initialPermissions]);

  const handleReadChange = (moduleIndex: number, checked: boolean) => {
    setPermissions(prev => {
      const updated = [...prev];
      updated[moduleIndex] = {
        ...updated[moduleIndex],
        read: checked,
        // If read is unchecked, write must also be unchecked
        write: checked ? updated[moduleIndex].write : false
      };
      return updated;
    });
  };

  const handleWriteChange = (moduleIndex: number, checked: boolean) => {
    setPermissions(prev => {
      const updated = [...prev];
      updated[moduleIndex] = {
        ...updated[moduleIndex],
        // If write is checked, read must also be checked
        read: checked ? true : updated[moduleIndex].read,
        write: checked
      };
      return updated;
    });
  };

  const handleSave = () => {
    onSave(permissions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Permissões do Usuário
          </DialogTitle>
          <DialogDescription>
            Configure as permissões de acesso para {userName}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-3 font-medium text-sm mb-2 px-4 py-2 bg-gray-50 rounded-lg">
            <div>Módulo</div>
            <div className="text-center">Leitura</div>
            <div className="text-center">Escrita</div>
          </div>

          <div className="space-y-3 mt-3">
            {permissions.map((permission, index) => (
              <div key={permission.module} className="grid grid-cols-3 items-center px-4 py-3 border rounded-md">
                <div className="font-medium">{permission.module}</div>
                <div className="flex justify-center">
                  <Checkbox 
                    id={`read-${permission.module}`}
                    checked={permission.read}
                    onCheckedChange={(checked) => handleReadChange(index, checked as boolean)}
                  />
                </div>
                <div className="flex justify-center">
                  <Checkbox 
                    id={`write-${permission.module}`}
                    checked={permission.write}
                    onCheckedChange={(checked) => handleWriteChange(index, checked as boolean)}
                    disabled={!permission.read}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Shield className="mr-2 h-4 w-4" />
            Salvar Permissões
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsModal;
