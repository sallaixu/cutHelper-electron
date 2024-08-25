import { message } from 'ant-design-vue';

export function showMessageShort(content) {
    message.success({
        top: `500px`,
        content: content,
        duration: 1,
        maxCount: 1,
        rtl: true,
        prefixCls: 'ant-message',
      });
}