import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Plus, Pencil, Trash2, Search, UserPlus, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { UserPermission } from '../types/auth';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permission: string;
  lastAccess: string;
}

const mockUsers: UserData[] = [
  { 
    id: '1', 
    name: 'Usuário Básico', 
    email: 'basic@malldre.com', 
    role: 'Operador',
    department: 'Logística',
    permission: 'initial',
    lastAccess: '2023-08-15 14:30' 
  },
  { 
    id: '2', 
    name: 'Usuário Intermediário', 
    email: 'mid@malldre.com', 
    role: 'Supervisor',
    department: 'Operações',
    permission: 'second',
    lastAccess: '2023-08-16 09:45' 
  },
  { 
    id: '3', 
    name: 'Gerente', 
    email: 'manager@malldre.com', 
    role: 'Administrador',
    department: 'Diretoria',
    permission: 'manager',
    lastAccess: '2023-08-16 11:20' 
  },
  { 
    id: '4', 
    name: 'Ana Silva', 
    email: 'ana.silva@malldre.com', 
    role: 'Operador',
    department: 'Estoque',
    permission: 'initial',
    lastAccess: '2023-08-14 16:05' 
  },
  { 
    id: '5', 
    name: 'Roberto Santos', 
    email: 'roberto.santos@malldre.com', 
    role: 'Supervisor',
    department: 'Expedição',
    permission: 'second',
    lastAccess: '2023-08-15 10:30' 
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
  const { toast } = useToast();

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
        lastAccess: 'Nunca acessou'
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
      <div className="min-h-screen flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-semibold flex items-center">
                  <UsersIcon className="mr-3 h-8 w-8 text-primary" />
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
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Buscar usuários..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="ml-4">
                    <Select>
                      <SelectTrigger className="w-[200px]">
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
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-left">
                      <th className="py-3 px-6 font-medium">Nome</th>
                      <th className="py-3 px-6 font-medium">Email</th>
                      <th className="py-3 px-6 font-medium">Cargo</th>
                      <th className="py-3 px-6 font-medium">Departamento</th>
                      <th className="py-3 px-6 font-medium">Último Acesso</th>
                      <th className="py-3 px-6 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6 font-medium">{user.name}</td>
                        <td className="py-3 px-6">{user.email}</td>
                        <td className="py-3 px-6">{user.role}</td>
                        <td className="py-3 px-6">{user.department}</td>
                        <td className="py-3 px-6">{user.lastAccess}</td>
                        <td className="py-3 px-6">
                          <div className="flex space-x-2">
                            <button 
                              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                              onClick={() => handleEditUser(user)}
                            >
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </button>
                            <button 
                              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t flex justify-between items-center">
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
        </main>
      </div>

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
    </AuthRequired>
  );
};

export default Users;
