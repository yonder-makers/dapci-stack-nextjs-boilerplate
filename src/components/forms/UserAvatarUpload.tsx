import { deleteAvatar } from '@/lib/apis/user.api';
import { useNotifications } from '@/providers/notification.providers';
import { GetProp, Space, Upload, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';

export type FormFields = {
  id?: string;
  name: string;
  email: string;
  password?: string;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserAvatarUploadProps = {
  companyId: string;
  userId: string;
  avatarUrl?: string;
};
export function UserAvatarUpload(props: UserAvatarUploadProps) {
  const { companyId } = props;
  const notifications = useNotifications();

  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    if (!props.avatarUrl) {
      return [];
    }

    return [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: props.avatarUrl,
      },
    ];
  });

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  async function onRemove() {
    try {
      await deleteAvatar(companyId, props.userId);
      notifications.success('Avatar picture removed');
    } catch (error) {
      notifications.error("Couldn't delete avatar picture");
    }
  }

  const url = `/api/companies/${companyId}/users/${props.userId}/avatar`;

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <ImgCrop rotationSlider>
        <Upload
          action={url}
          listType="picture-card"
          maxCount={1}
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          onRemove={onRemove}
        >
          {fileList.length < 1 && '+ Upload'}
        </Upload>
      </ImgCrop>
    </Space>
  );
}
