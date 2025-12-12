<template>
  <StandardEditPage
    :id="mode === 'edit' ? userId : undefined"
    :save-api="saveUser"
    :detail-api="mode === 'edit' ? userApi.getUserDetail : undefined"
    :title="pageTitle"
    :form-fields="formFields"
    :mode="mode"
    :steps="steps"
    @success="handleSuccess"
    @cancel="handleCancel"
    @back="handleBack"
  />
</template>

<script setup lang="ts">
import type { FormField, StepConfig } from '@/types/template'

import { userApi } from './api'

const route = useRoute()
const router = useRouter()

const mode = computed(() => {
  return route.name === 'user-create' ? 'create' : 'edit'
})

const userId = computed(() => route.params.id as string)

const pageTitle = computed(() => {
  return mode.value === 'create' ? '新增用户' : '编辑用户'
})

// 表单字段配置
const formFields: FormField[] = [
  {
    name: 'userName',
    label: '用户名',
    component: 'a-input',
    required: true,
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '用户名长度为3-20个字符' }
    ],
    props: {
      placeholder: '请输入用户名',
      maxlength: 20
    }
  },
  {
    name: 'email',
    label: '邮箱',
    component: 'a-input',
    required: true,
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ],
    props: {
      placeholder: '请输入邮箱'
    }
  },
  {
    name: 'phone',
    label: '手机号',
    component: 'a-input',
    rules: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }],
    props: {
      placeholder: '请输入手机号'
    }
  },
  {
    name: 'password',
    label: '密码',
    component: 'a-input-password',
    required: mode.value === 'create',
    rules:
      mode.value === 'create'
        ? [
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度至少6位' }
          ]
        : [{ min: 6, message: '密码长度至少6位' }],
    show: mode.value === 'create' || false, // 编辑模式下默认不显示密码字段
    props: {
      placeholder: mode.value === 'create' ? '请输入密码' : '留空则不修改密码'
    }
  },
  {
    name: 'confirmPassword',
    label: '确认密码',
    component: 'a-input-password',
    required: mode.value === 'create',
    rules: [
      { required: mode.value === 'create', message: '请确认密码' },
      {
        validator: (rule: any, value: any) => {
          const password = formData.value.password
          if (value && password && value !== password) {
            return Promise.reject(new Error('两次输入的密码不一致'))
          }
          return Promise.resolve()
        }
      }
    ],
    show: mode.value === 'create' || false,
    dependencies: ['password'],
    props: {
      placeholder: '请确认密码'
    }
  },
  {
    name: 'userType',
    label: '用户类型',
    component: 'a-select',
    defaultValue: 'user',
    rules: [{ required: true, message: '请选择用户类型' }],
    props: {
      placeholder: '请选择用户类型',
      options: [
        { label: '普通用户', value: 'user' },
        { label: '管理员', value: 'admin' }
      ]
    }
  },
  {
    name: 'sex',
    label: '性别',
    component: 'a-radio-group',
    defaultValue: 'male',
    props: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' }
      ]
    }
  },
  {
    name: 'status',
    label: '状态',
    component: 'a-switch',
    defaultValue: true,
    props: {
      checkedChildren: '正常',
      unCheckedChildren: '禁用'
    }
  },
  {
    name: 'avatar',
    label: '头像',
    component: 'BaseUpload',
    props: {
      accept: 'image/*',
      listType: 'picture-card',
      maxCount: 1
    }
  }
]

// 步骤配置（如果需要分布式表单）
const steps: StepConfig[] = [
  {
    title: '基础信息',
    description: '填写用户的基本信息'
    // component: defineAsyncComponent(() => import('./steps/BasicInfo.vue'))
  },
  {
    title: '权限设置',
    description: '设置用户权限和角色'
    // component: defineAsyncComponent(() => import('./steps/Permissions.vue'))
  },
  {
    title: '确认信息',
    description: '确认用户信息无误'
    // component: defineAsyncComponent(() => import('./steps/Confirmation.vue'))
  }
]

// 保存用户
const saveUser = async (data: any) => {
  if (mode.value === 'create') {
    return await userApi.createUser(data)
  } else {
    return await userApi.updateUser(userId.value, data)
  }
}

// 成功回调
const handleSuccess = (data: any) => {
  message.success(mode.value === 'create' ? '用户创建成功' : '用户保存成功')
  void router.push('/system/user')
}

// 取消回调
const handleCancel = () => {
  router.back()
}

// 返回回调
const handleBack = () => {
  router.back()
}
</script>
