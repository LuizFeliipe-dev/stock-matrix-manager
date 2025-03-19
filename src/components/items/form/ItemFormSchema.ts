
import { z } from 'zod';

export const itemFormSchema = z.object({
  code: z.string().min(3, { message: 'Código deve ter pelo menos 3 caracteres' }),
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  description: z.string().optional(),
  group: z.string().min(1, { message: 'Selecione um grupo' }),
  supplier: z.string().min(1, { message: 'Selecione um fornecedor' }),
  initialStock: z.coerce.number().min(0, { message: 'Estoque inicial não pode ser negativo' }),
  minStock: z.coerce.number().min(0, { message: 'Estoque mínimo não pode ser negativo' }),
  price: z.coerce.number().min(0, { message: 'Preço não pode ser negativo' }),
  location: z.string().optional(),
});
