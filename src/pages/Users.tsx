
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
  Users as UsersIcon, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  UserPlus, 
  Shield, 
  X,
  KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
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
import { UserPermission } from '../types/auth';
import UserPermissionsModal, { UserPermission as UserPermissionItem } from '../components/users/UserPermissionsModal';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permission: string;
  lastAccess: string;
  permissions?: UserPermissionItem[];
}

const mockUsers: UserData[] = [
  { 
    id: '1', 
    name: 'Usuário Básico', 
    email: 'basic@malldre.com', 
    role: 'Operador',
    department: 'Logística',
    permission: 'initial',
    lastAccess: '2023-08-15 14:30',
    permissions: [
      { module: 'USUARIO', read: true, write: false },
      { module: 'ARMAZEM', read: true, write: false },
      { module: 'INVENTARIO', read: true, write: false },
      { module: 'RELATORIO', read: true, write: false }
    ]
  },
  { 
    id: '2', 
    name: 'Usuário Intermediário', 
    email: 'mid@malldre.com', 
    role: 'Supervisor',
    department: 'Operações',
    permission: 'second',
    lastAccess: '2023-08-16 09:45',
    permissions: [
      { module: 'USUARIO', read: true, write: true },
      { module: 'ARMAZEM', read: true, write: true },
      { module: 'INVENTARIO', read: true, write: false },
      { module: 'RELATORIO', read: true, write: false }
    ]
  },
  { 
    id: '3', 
    name: 'Gerente', 
    email: 'manager@malldre.com', 
    role: 'Administrador',
    department: 'Diretoria',
    permission: 'manager',
    lastAccess: '2023-08-16 11:20',
    permissions: [
      { module: 'USUARIO', read: true, write: true },
      { module: 'ARMAZEM', read: true, write: true },
      { module: 'INVENTARIO', read: true, write: true },
      { module: 'RELATORIO', read: true, write: true }
    ]
  },
  { 
    id: '4', 
    name: 'Ana Silva', 
    email: 'ana.silva@malldre.com', 
    role: 'Operador',
    department: 'Estoque',
    permission: 'initial',
    lastAccess: '2023-08-14 16:05',
    permissions: [
      { module: 'USUARIO', read: false, write: false },
      { module: 'ARMAZEM', read: true, write: false },
      { module: 'INVENTARIO', read: true, write: false },
      { module: 'RELATORIO', read: true, write: false }
    ]
  },
  { 
    id: '5', 
    name: 'Roberto Santos', 
    email: 'roberto.santos@malldre.com', 
    role: 'Supervisor',
    department: 'Expedição',
    permission: 'second',
    lastAccess: '2023-08-15 10:30',
    permissions: [
      { module: 'USUARIO', read: true, write: false },
      { module: 'ARMAZEM', read: true, write: true },
      { module: 'INVENTARIO', read: true, write: true },
      { module: 'RELATORIO', read: true, write: false }
    ]
  },
];

const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  role: z.string().min(1, { message: 'Selecione um cargo' }),
  department: z.string().min(1, { message: 'Selecione um departamento' }),
  permission: z.enum(['initial', 'second', 'manager'], { 
    required_error: 'Selecione um nível de permissão' 
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const Users = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<(UserFormValues & { id: string }) | null>(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      department: '',
      permission: 'initial',
    }
  });

  const handleAddUser = () => {
    setEditingUser(null);
    form.reset({
      name: '',
      email: '',
      role: '',
      department: '',
      permission: 'initial',
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      permission: user.permission as UserPermission,
    });
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      permission: user.permission as UserPermission,
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuário excluído",
      description: "O usuário foi removido com sucesso",
    });
  };

  const handleOpenPermissions = (user: UserData) => {
    setSelectedUser(user);
    setPermissionsModalOpen(true);
  };

  const handleSavePermissions = (permissions: UserPermissionItem[]) => {
    if (selectedUser) {
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            permissions
          };
        }
        return user;
      }));
      
      toast({
        title: "Permissões atualizadas",
        description: "As permissões do usuário foram atualizadas com sucesso",
      });
    }
  };

  const onSubmit = (data: UserFormValues) => {
    if (editingUser) {
      setUsers(users.map(user => {
        if (user.id === editingUser.id) {
          return {
            ...user,
            name: data.name,
            email: data.email,
            role: data.role,
            department: data.department,
            permission: data.permission,
          };
        }
        return user;
      }));
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso",
      });
    } else {
      const newUser: UserData = {
        id: (users.length + 1).toString(),
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        permission: data.permission,
        lastAccess: 'Nunca acessou',
        permissions: [
          { module: 'USUARIO', read: false, write: false },
          { module: 'ARMAZEM', read: false, write: false },
          { module: 'INVENTARIO', read: false, write: false },
          { module: 'RELATORIO', read: false, write: false }
        ]
      };
      setUsers([...users, newUser]);
      toast({
        title: "Usuário adicionado",
        description: "Novo usuário foi adicionado com sucesso",
      });
    }
    setOpenDialog(false);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <UsersIcon className="mr-3 h-6 w-6 text-primary" />
                  Usuários
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os usuários do sistema
                </p>
              </div>
              
              <Button onClick={handleAddUser}>
                <UserPlus className="mr-2 h-5 w-5" />
                Novo Usuário
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 border-b">
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-3'}`}>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Buscar usuários..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className={isMobile ? "w-full" : "w-[200px]"}>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos os departamentos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os departamentos</SelectItem>
                        <SelectItem value="logistica">Logística</SelectItem>
                        <SelectItem value="operacoes">Operações</SelectItem>
                        <SelectItem value="estoque">Estoque</SelectItem>
                        <SelectItem value="expedicao">Expedição</SelectItem>
                        <SelectItem value="diretoria">Diretoria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      {!isMobile && <TableHead>Cargo</TableHead>}
                      {!isMobile && <TableHead>Departamento</TableHead>}
                      <TableHead>Acesso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-6 text-muted-foreground">
                          Nenhum usuário encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="max-w-[140px] truncate">{user.email}</TableCell>
                          {!isMobile && <TableCell>{user.role}</TableCell>}
                          {!isMobile && <TableCell>{user.department}</TableCell>}
                          <TableCell className="text-sm">{user.lastAccess}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditUser(user)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleOpenPermissions(user)}
                                title="Gerenciar permissões"
                              >
                                <KeyRound className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
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
              
              <div className="p-4 border-t flex flex-wrap justify-between items-center gap-3">
                <div className="text-sm text-gray-500">
                  Exibindo {filteredUsers.length} de {users.length} usuários
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">Próxima</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>

      {/* User Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Edite as informações do usuário abaixo.' 
                : 'Preencha os campos abaixo para adicionar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Operador">Operador</SelectItem>
                          <SelectItem value="Supervisor">Supervisor</SelectItem>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um departamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Logística">Logística</SelectItem>
                          <SelectItem value="Operações">Operações</SelectItem>
                          <SelectItem value="Estoque">Estoque</SelectItem>
                          <SelectItem value="Expedição">Expedição</SelectItem>
                          <SelectItem value="Diretoria">Diretoria</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Permissão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="initial">Básico (Visualização)</SelectItem>
                        <SelectItem value="second">Intermediário (Edição)</SelectItem>
                        <SelectItem value="manager">Administrador (Total)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  <Shield className="mr-2 h-4 w-4" />
                  {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Permissions Modal */}
      {selectedUser && (
        <UserPermissionsModal
          open={permissionsModalOpen}
          onOpenChange={setPermissionsModalOpen}
          userName={selectedUser.name}
          initialPermissions={selectedUser.permissions}
          onSave={handleSavePermissions}
        />
      )}
    </AuthRequired>
  );
};

export default Users;
