import { useEffect, useState } from 'react';
import { TagCloud } from 'react-tagcloud';
import { getRequest } from '../api/api.js'

function TagsCloud() {
    const [data,setData] = useState([]);
    useEffect(()=>{
        const getTags = async () => {
            const result = await getRequest('/tags');
            const filteredResult = result.filter(e => e.tags != null && e.tags != '');
            const allTags = filteredResult.flatMap(item => item.tags.split(','));
            const cloud = allTags.map(tag => ({"value":tag,"count":Math.floor(Math.random() * (35 - 12 + 1)) + 12}));
            setData(cloud);
        }
        getTags();
    },[])
    return (
        <div className='flex justify-center items-center p-2 m-2 w-auto h-screen'>
            <TagCloud
                minSize={12}
                maxSize={35}
                tags={data}
                onClick={tag => alert(`'${tag.value}' was selected!`)}
            />
        </div>

    );
}

export default TagsCloud;