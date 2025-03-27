
import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  KeyRound, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const permissionFormSchema = z.object({
  code: z.string().min(2, { message: 'Código deve ter pelo menos 2 caracteres' }),
  role: z.enum(['read', 'write'], { 
    required_error: 'Selecione uma função'
  }),
});

type PermissionFormValues = z.infer<typeof permissionFormSchema>;

interface Permission {
  id: number;
  code: string;
  role: 'read' | 'write';
}

// Mock data
const initialPermissions: Permission[] = [
  {
    id: 1,
    code: 'USUARIO',
    role: 'read',
  },
  {
    id: 2,
    code: 'USUARIO',
    role: 'write',
  },
  {
    id: 3,
    code: 'ITEM',
    role: 'read',
  },
  {
    id: 4,
    code: 'ITEM',
    role: 'write',
  },
  {
    id: 5,
    code: 'FORNECEDOR',
    role: 'read',
  },
];

const Permissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      code: '',
      role: 'read',
    }
  });

  const handleAddPermission = () => {
    setEditingPermission(null);
    form.reset({
      code: '',
      role: 'read',
    });
    setOpenDialog(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    form.reset({
      code: permission.code,
      role: permission.role,
    });
    setOpenDialog(true);
  };

  const handleDeletePermission = (id: number) => {
    setPermissions(permissions.filter(p => p.id !== id));
    toast({
      title: "Permissão excluída",
      description: "A permissão foi removida com sucesso",
    });
  };

  const onSubmit = (data: PermissionFormValues) => {
    // Check if a permission with the same code and role already exists
    const exists = permissions.some(
      p => p.code === data.code && 
      p.role === data.role &&
      (editingPermission ? p.id !== editingPermission.id : true)
    );

    if (exists) {
      toast({
        title: "Permissão duplicada",
        description: "Já existe uma permissão com este código e função",
        variant: "destructive"
      });
      return;
    }

    if (editingPermission) {
      setPermissions(permissions.map(p => {
        if (p.id === editingPermission.id) {
          return {
            ...p,
            code: data.code,
            role: data.role,
          };
        }
        return p;
      }));
      toast({
        title: "Permissão atualizada",
        description: "A permissão foi atualizada com sucesso",
      });
    } else {
      const newPermission: Permission = {
        id: Math.max(0, ...permissions.map(p => p.id)) + 1,
        code: data.code,
        role: data.role,
      };
      setPermissions([...permissions, newPermission]);
      toast({
        title: "Permissão adicionada",
        description: "Nova permissão foi adicionada com sucesso",
      });
    }
    setOpenDialog(false);
  };

  const filteredPermissions = permissions.filter(permission => 
    permission.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthRequired>
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <KeyRound className="mr-3 h-6 w-6 text-primary" />
                  Permissões
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie as permissões do sistema
                </p>
              </div>
              
              <Button onClick={handleAddPermission}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Permissão
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 border-b">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por código..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          Nenhuma permissão encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPermissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">{permission.code}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              permission.role === 'read'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {permission.role === 'read' ? 'Leitura' : 'Escrita'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditPermission(permission)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeletePermission(permission.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPermission ? 'Editar Permissão' : 'Adicionar Nova Permissão'}</DialogTitle>
            <DialogDescription>
              {editingPermission 
                ? 'Edite as informações da permissão abaixo.' 
                : 'Preencha os campos abaixo para adicionar uma nova permissão.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: USUARIO, ITEM, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="read">Leitura</SelectItem>
                        <SelectItem value="write">Escrita</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {editingPermission ? 'Salvar Alterações' : 'Cadastrar Permissão'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Permissions;
