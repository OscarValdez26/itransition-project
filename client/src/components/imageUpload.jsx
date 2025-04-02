import { useState } from 'react';
import { Button, HStack } from 'rsuite';
import { useTranslation } from 'react-i18next';

const ImageUpload = ({ setUrl }) => {
    const { t } = useTranslation();
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [name,setName] = useState(t('No_file_selected'));
    const handleChange = (e) => {
        setImage(e.target.files[0]);
        const fileName = e.target.files[0].name;
        if(fileName.length > 20){
            const subName = `${fileName.substring(0,10)}...${fileName.substring(fileName.length-10,fileName.length)}`;
            setName(subName);
        }else{
            setName(fileName);
        }      
        setError('');
    };

    const handleUpload = async () => {
        setLoading(true);
        const storage = import.meta.env.VITE_BACKEND_URL;
        if (!image) return;
      
        const formData = new FormData();
        formData.append('image', image);
      
        try {
          const response = await fetch(`${storage}/upload`, {
            method: 'POST',
            body: formData,
            credentials:"include",
          }); 
      
          const data = await response.json();
          setUrl(`${storage}${data.filePath}`);
          setLoading(false);
        } catch (error) {
          console.error('Error al subir el archivo:', error);
        }
      };

    //   const handleUpload = () => {
    //     if (image) {
    //         setLoading(true);
    //         const newUUID = uuidv4();
    //         const storageRef = ref(storage, `images/${newUUID}`);
    //         uploadBytes(storageRef, image)
    //             .then(() => {
    //                 return getDownloadURL(storageRef);
    //             })
    //             .then((downloadURL) => {
    //                 setUrl(downloadURL);
    //                 setLoading(false);
    //             })
    //             .catch((err) => {
    //                 setError(err.message);
    //                 setLoading(false);
    //             });
    //     } else {
    //         setError(t('Select_image_please'));
    //     }
    // };

    return (
        <div>
            <p className="text-bold">{t('Image')}</p>
            <HStack>         
            <input type="file" accept="image/*" onChange={handleChange} id='upload_file' style={{ display: 'none' }}/>  
            <div className='flex justify-between items-center w-96' >
                <label  htmlFor='upload_file' className='border-solid border-2 border-gray-400 m-2 p-2 rounded-lg'>{t('Select_image')}</label>
                <label >{name}</label>
            </div>
            <Button appearance='primary' color='cyan' onClick={handleUpload} disabled={loading}>
                {loading ? t('Loading') : t('Upload')}
            </Button>  
        </HStack>
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        </div>
        
        
    );
};

export default ImageUpload;