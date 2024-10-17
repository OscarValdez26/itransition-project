const URL = 'http://localhost:3000'

export async function postRequest(path,json) {
    try {
        //console.log(`${URL}${path}   `,json)
        const response = await fetch(`${URL}${path}`, {method: "POST",headers: {"Content-Type": "application/json"},credentials:"include",
            body: JSON.stringify(json)
        });
        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getRequest(path){
    try {
        //console.log(`${URL}${path}`);
        const response = await fetch(`${URL}${path}`,{method: "GET",headers: {"Content-Type": "application/json"},credentials:"include"});
        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}