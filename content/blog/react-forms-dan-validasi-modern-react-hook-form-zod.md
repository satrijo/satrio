---
title: "React Forms dan Validasi Modern: React Hook Form, Zod, dan Pattern Terbaik"
date: 2026-01-30T00:00:00.000Z
description: "Kuasai form handling di React dengan React Hook Form, Zod validation, dan pattern modern. Pelajari controlled/uncontrolled forms, file uploads, dan form kompleks."
category: React
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

# React Forms dan Validasi Modern: React Hook Form, Zod, dan Pattern Terbaik

Form adalah komponen fundamental dalam hampir setiap aplikasi web. Dari form login sederhana hingga form multi-step yang kompleks, kemampuan mengelola form dengan efektif adalah keterampilan esensial bagi developer React. Artikel ini akan membahas secara komprehensif tentang form handling modern di React menggunakan React Hook Form, Zod untuk validasi, dan pattern-pattern terbaik yang digunakan di industri pada tahun 2026.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami React Hooks dan Router. Jika Anda belum familiar dengan Hooks, silakan baca [React Hooks Lengkap: useState, useEffect, dan Custom Hooks](/blog/react-hooks-lengkap-usestate-useeffect-dan-custom-hooks) dan [React Router dan Navigasi Aplikasi Single Page](/blog/react-router-dan-navigasi-aplikasi-single-page) terlebih dahulu.

## Evolusi Form Handling di React

### Dari Controlled ke Modern Solutions

Perjalanan form handling di React telah berevolusi signifikan:

1. **Controlled Components (2013-2018)**: Menggunakan state untuk setiap input
2. **Formik (2018-2022)**: Library form yang populer namun verbose
3. **React Hook Form + Zod (2020-2026)**: Solusi modern yang performant dan type-safe
4. **Server Actions + Form (2024-2026)**: Integrasi form dengan Server Components

### Mengapa React Hook Form?

React Hook Form (RHF) menjadi pilihan utama di 2026 karena:

- **Performance**: Uncontrolled components dengan refs, minimal re-renders
- **Type Safety**: Integrasi sempurna dengan TypeScript
- **Bundle Size**: ~9KB gzipped, jauh lebih kecil dari Formik
- **Ekosistem**: Integrasi dengan UI libraries (MUI, Chakra, Ant Design)
- **Validasi**: Native integration dengan Zod, Yup, Joi

## Fundamentals React Hook Form

### Setup dan Instalasi

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Form Dasar dengan RHF

```tsx
// src/components/BasicForm.tsx
import { useForm } from 'react-hook-form';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

export function BasicForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log(data);
    // Simulasi API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">Nama Depan</label>
        <input
          id="firstName"
          {...register('firstName', { required: 'Nama depan wajib diisi' })}
        />
        {errors.firstName && (
          <span className="error">{errors.firstName.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="lastName">Nama Belakang</label>
        <input
          id="lastName"
          {...register('lastName', { required: 'Nama belakang wajib diisi' })}
        />
        {errors.lastName && (
          <span className="error">{errors.lastName.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email wajib diisi',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Format email tidak valid',
            },
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mengirim...' : 'Kirim'}
      </button>
    </form>
  );
}
```

### Understanding Register

Fungsi `register` adalah core dari RHF:

```tsx
// Register mengembalikan props yang di-spread ke input
const { register } = useForm();

// Basic usage
<input {...register('fieldName')} />

// Dengan validation rules
<input
  {...register('email', {
    required: true,
    minLength: 5,
    maxLength: 100,
    pattern: /regex/,
    validate: (value) => value.includes('@'),
  })}
/>

// Register juga bisa digunakan dengan ref
const { ref, ...rest } = register('fieldName');
<input ref={ref} {...rest} />
```

## Validasi dengan Zod

### Schema Definition

Zod adalah TypeScript-first schema validation library yang sempurna untuk RHF:

```tsx
// src/schemas/user.ts
import { z } from 'zod';

export const userSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Nama depan minimal 2 karakter')
    .max(50, 'Nama depan maksimal 50 karakter'),
  lastName: z
    .string()
    .min(2, 'Nama belakang minimal 2 karakter')
    .max(50, 'Nama belakang maksimal 50 karakter'),
  email: z.string().email('Format email tidak valid'),
  age: z
    .number()
    .min(18, 'Minimal umur 18 tahun')
    .max(120, 'Umur tidak valid'),
  website: z.string().url('Format URL tidak valid').optional(),
  bio: z.string().max(500, 'Bio maksimal 500 karakter').optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
```

### Integrasi RHF dengan Zod

```tsx
// src/components/UserForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData } from '@/schemas/user';

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    console.log('Valid data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">Nama Depan</label>
        <input id="firstName" {...register('firstName')} />
        {errors.firstName && (
          <span className="error">{errors.firstName.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="lastName">Nama Belakang</label>
        <input id="lastName" {...register('lastName')} />
        {errors.lastName && (
          <span className="error">{errors.lastName.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="age">Umur</label>
        <input id="age" type="number" {...register('age', { valueAsNumber: true })} />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
```

## Schema Validasi Lanjutan

### Validasi Kondisional

```tsx
// src/schemas/order.ts
import { z } from 'zod';

export const orderSchema = z
  .object({
    orderType: z.enum(['delivery', 'pickup']),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    pickupTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.orderType === 'delivery') {
        return !!data.address && !!data.city && !!data.postalCode;
      }
      return true;
    },
    {
      message: 'Alamat lengkap wajib diisi untuk pengiriman',
      path: ['address'],
    }
  )
  .refine(
    (data) => {
      if (data.orderType === 'pickup') {
        return !!data.pickupTime;
      }
      return true;
    },
    {
      message: 'Waktu pickup wajib diisi',
      path: ['pickupTime'],
    }
  );

export type OrderFormData = z.infer<typeof orderSchema>;
```

### Validasi Array dan Nested Objects

```tsx
// src/schemas/product.ts
import { z } from 'zod';

const variantSchema = z.object({
  size: z.string().min(1, 'Ukuran wajib diisi'),
  color: z.string().min(1, 'Warna wajib diisi'),
  stock: z.number().min(0, 'Stok tidak boleh negatif'),
  price: z.number().positive('Harga harus positif'),
});

const imageSchema = z.object({
  url: z.string().url('URL gambar tidak valid'),
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  basePrice: z.number().positive('Harga dasar harus positif'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  tags: z.array(z.string()).min(1, 'Minimal 1 tag'),
  variants: z.array(variantSchema).min(1, 'Minimal 1 varian'),
  images: z.array(imageSchema).min(1, 'Minimal 1 gambar'),
  specifications: z.record(z.string()), // Dynamic key-value pairs
});

export type ProductFormData = z.infer<typeof productSchema>;
```

### Custom Validation

```tsx
// src/schemas/auth.ts
import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username minimal 3 karakter')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
    email: z.string().email('Email tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
      .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
      .regex(/[0-9]/, 'Password harus mengandung angka')
      .regex(/[^A-Za-z0-9]/, 'Password harus mengandung karakter spesial'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'Anda harus menyetujui syarat dan ketentuan',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

// Async validation untuk username yang unik
export const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .refine(
      async (username) => {
        // Check ke server
        const response = await fetch(`/api/check-username?username=${username}`);
        const { available } = await response.json();
        return available;
      },
      { message: 'Username sudah digunakan' }
    ),
});
```

## Field Arrays (Dynamic Fields)

### Menambah dan Menghapus Fields Dinamis

```tsx
// src/components/DynamicFieldForm.tsx
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1, 'Nama item wajib diisi'),
      quantity: z.number().min(1, 'Minimal 1'),
      price: z.number().positive('Harga harus positif'),
    })
  ).min(1, 'Minimal 1 item'),
});

type FormData = z.infer<typeof schema>;

export function DynamicFieldForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [{ name: '', quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const total = items?.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0
  );

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id} className="item-row">
          <input
            {...register(`items.${index}.name`)}
            placeholder="Nama item"
          />
          <input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            placeholder="Jumlah"
          />
          <input
            type="number"
            {...register(`items.${index}.price`, { valueAsNumber: true })}
            placeholder="Harga"
          />
          <button type="button" onClick={() => remove(index)}>
            Hapus
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1, price: 0 })}
      >
        Tambah Item
      </button>

      <div className="total">Total: Rp {total?.toLocaleString()}</div>

      <button type="submit">Simpan</button>
    </form>
  );
}
```

## File Upload Handling

### Single dan Multiple File Upload

```tsx
// src/components/FileUploadForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const fileSchema = z
  .instanceof(FileList)
  .refine((files) => files?.length > 0, 'File wajib diupload')
  .refine(
    (files) => files?.[0]?.size <= MAX_FILE_SIZE,
    'Ukuran file maksimal 5MB'
  )
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    'Hanya menerima format .jpg, .jpeg, .png, dan .webp'
  );

const schema = z.object({
  title: z.string().min(3),
  thumbnail: fileSchema,
  gallery: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length <= 5,
      'Maksimal 5 gambar gallery'
    ),
});

type FormData = z.infer<typeof schema>;

export function FileUploadForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('thumbnail', data.thumbnail[0]);
    
    if (data.gallery) {
      Array.from(data.gallery).forEach((file) => {
        formData.append('gallery', file);
      });
    }

    // Upload ke server
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Judul</label>
        <input id="title" {...register('title')} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div>
        <label htmlFor="thumbnail">Thumbnail</label>
        <Controller
          name="thumbnail"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <input
              {...field}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  onChange(e.target.files);
                }
              }}
            />
          )}
        />
        {preview && (
          <img src={preview} alt="Preview" className="preview" />
        )}
        {errors.thumbnail && (
          <span className="error">{errors.thumbnail.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="gallery">Gallery (Maksimal 5)</label>
        <input
          id="gallery"
          type="file"
          multiple
          accept="image/*"
          {...register('gallery')}
        />
        {errors.gallery && (
          <span className="error">{errors.gallery.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mengupload...' : 'Upload'}
      </button>
    </form>
  );
}
```

### Drag and Drop Upload

```tsx
// src/components/DropzoneUpload.tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';

export function DropzoneUpload({ name }: { name: string }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const onDrop = useCallback(
          (acceptedFiles: File[]) => {
            onChange(acceptedFiles);
          },
          [onChange]
        );

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop,
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
          },
          maxFiles: 5,
        });

        return (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop files here...</p>
            ) : (
              <p>Drag & drop files here, or click to select</p>
            )}
            {value && value.length > 0 && (
              <div className="file-list">
                {value.map((file: File, index: number) => (
                  <div key={index} className="file-item">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
```

## Multi-Step Forms

### Wizard Pattern dengan State Management

```tsx
// src/components/MultiStepForm.tsx
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const step1Schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
});

const step2Schema = z.object({
  company: z.string().min(2),
  position: z.string().min(2),
  experience: z.number().min(0),
});

const step3Schema = z.object({
  interests: z.array(z.string()).min(1),
  newsletter: z.boolean(),
});

const schemas = [step1Schema, step2Schema, step3Schema];

type FormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema>;

const steps = [
  { id: 'personal', title: 'Data Pribadi' },
  { id: 'professional', title: 'Data Profesional' },
  { id: 'preferences', title: 'Preferensi' },
];

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const methods = useForm<FormData>({
    resolver: zodResolver(schemas[currentStep]),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormData) => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      console.log('Final data:', data);
      // API call here
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="multi-step-form">
        {/* Progress Bar */}
        <div className="steps-indicator">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`step ${
                index === currentStep
                  ? 'active'
                  : completedSteps.includes(index)
                  ? 'completed'
                  : ''
              }`}
              disabled={index > currentStep && !completedSteps.includes(index)}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && <PersonalInfoStep />}
          {currentStep === 1 && <ProfessionalInfoStep />}
          {currentStep === 2 && <PreferencesStep />}

          <div className="form-actions">
            {currentStep > 0 && (
              <button type="button" onClick={handleBack}>
                Kembali
              </button>
            )}
            <button type="submit" disabled={isSubmitting}>
              {currentStep === steps.length - 1 ? 'Selesai' : 'Lanjut'}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

// Step Components
function PersonalInfoStep() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <h2>Data Pribadi</h2>
      <input {...register('firstName')} placeholder="Nama Depan" />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      
      <input {...register('lastName')} placeholder="Nama Belakang" />
      {errors.lastName && <span>{errors.lastName.message}</span>}
      
      <input {...register('email')} placeholder="Email" type="email" />
      {errors.email && <span>{errors.email.message}</span>}
    </div>
  );
}

function ProfessionalInfoStep() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <h2>Data Profesional</h2>
      <input {...register('company')} placeholder="Perusahaan" />
      {errors.company && <span>{errors.company.message}</span>}
      
      <input {...register('position')} placeholder="Posisi" />
      {errors.position && <span>{errors.position.message}</span>}
      
      <input
        {...register('experience', { valueAsNumber: true })}
        placeholder="Tahun Pengalaman"
        type="number"
      />
      {errors.experience && <span>{errors.experience.message}</span>}
    </div>
  );
}

function PreferencesStep() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <h2>Preferensi</h2>
      <label>
        <input type="checkbox" value="tech" {...register('interests')} />
        Teknologi
      </label>
      <label>
        <input type="checkbox" value="business" {...register('interests')} />
        Bisnis
      </label>
      {errors.interests && <span>{errors.interests.message}</span>}
      
      <label>
        <input type="checkbox" {...register('newsletter')} />
        Berlangganan newsletter
      </label>
    </div>
  );
}
```

## Form dengan Server Actions (Next.js App Router)

### Integrasi React Hook Form dengan Server Actions

```tsx
// app/components/ContactForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { contactSchema, ContactFormData } from '@/schemas/contact';
import { submitContactForm } from '@/app/actions/contact';

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    startTransition(async () => {
      const response = await submitContactForm(data);
      setResult(response);
      
      if (response.success) {
        reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {result?.message && (
        <div className={result.success ? 'success' : 'error'}>
          {result.message}
        </div>
      )}

      <div>
        <label htmlFor="name">Nama</label>
        <input id="name" {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="message">Pesan</label>
        <textarea id="message" {...register('message')} rows={5} />
        {errors.message && <span>{errors.message.message}</span>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
    </form>
  );
}

// app/actions/contact.ts
'use server';

import { contactSchema } from '@/schemas/contact';
import { sendEmail } from '@/lib/email';

export async function submitContactForm(data: unknown) {
  try {
    // Validasi di server
    const validated = contactSchema.parse(data);
    
    // Proses data
    await sendEmail({
      to: 'admin@example.com',
      subject: `Pesan dari ${validated.name}`,
      body: validated.message,
      replyTo: validated.email,
    });
    
    return { success: true, message: 'Pesan berhasil dikirim!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validasi gagal',
        errors: error.flatten().fieldErrors,
      };
    }
    
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}
```

## Advanced Patterns

### Form dengan Autosave

```tsx
// src/components/AutosaveForm.tsx
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounce } from '@/hooks/useDebounce';

export function AutosaveForm() {
  const { register, control, formState: { dirtyFields } } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const watchedValues = useWatch({ control });
  const debouncedValues = useDebounce(watchedValues, 1000);

  useEffect(() => {
    if (Object.keys(dirtyFields).length > 0) {
      // Autosave ke server
      saveDraft(debouncedValues);
    }
  }, [debouncedValues, dirtyFields]);

  return (
    <form>
      <input {...register('title')} placeholder="Judul" />
      <textarea {...register('content')} placeholder="Konten" rows={10} />
      <div className="autosave-status">Tersimpan otomatis</div>
    </form>
  );
}
```

### Form dengan Dependent Fields

```tsx
// src/components/DependentFieldsForm.tsx
import { useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';

export function DependentFieldsForm() {
  const { register, control, setValue, watch } = useForm();
  
  const country = watch('country');
  const province = watch('province');

  // Reset province saat country berubah
  useEffect(() => {
    setValue('province', '');
    setValue('city', '');
  }, [country, setValue]);

  // Reset city saat province berubah
  useEffect(() => {
    setValue('city', '');
  }, [province, setValue]);

  const provinces = country ? getProvincesByCountry(country) : [];
  const cities = province ? getCitiesByProvince(province) : [];

  return (
    <form>
      <select {...register('country')}>
        <option value="">Pilih Negara</option>
        <option value="id">Indonesia</option>
        <option value="sg">Singapore</option>
      </select>

      <select {...register('province')} disabled={!country}>
        <option value="">Pilih Provinsi</option>
        {provinces.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select {...register('city')} disabled={!province}>
        <option value="">Pilih Kota</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </form>
  );
}
```

## Kesimpulan

Form handling modern di React telah berevolusi jauh dari controlled components yang verbose. Dengan React Hook Form dan Zod, kita memiliki solusi yang:

1. **Performant**: Minimal re-renders dengan uncontrolled components
2. **Type-safe**: Full TypeScript support dari schema ke form
3. **Developer-friendly**: API yang intuitif dan well-documented
4. **Flexible**: Bisa digunakan dengan berbagai UI libraries

Poin-poin kunci yang perlu diingat:

- **Gunakan Zod untuk validasi**: Type-safe dan expressive
- **Manfaatkan useFieldArray**: Untuk fields dinamis
- **Integrasikan dengan Server Actions**: Untuk form submission modern
- **Implementasikan UX yang baik**: Loading states, error handling, dan feedback
- **Test forms Anda**: Pastikan validasi dan submission berfungsi dengan baik

Dengan menguasai pattern-pattern ini, Anda siap membangun form yang kompleks, user-friendly, dan maintainable dalam aplikasi React modern.

## Artikel Selanjutnya

Setelah memahami Forms dan Validasi di React, lanjutkan pembelajaran Anda dengan membaca [React Performance Optimization: Teknik dan Best Practices](/blog/react-performance-optimization-teknik-dan-best-practices).
