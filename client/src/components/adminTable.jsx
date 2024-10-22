import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getRequest } from "../api/api";
import { AppContext } from "../context/Provider";
import { Button, HStack, Text, SelectPicker } from "rsuite";

function AdminTable({ setAdmin, setBlocked, admin, blocked }) {
    const { user, theme } = useContext(AppContext);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedType, setSelectedType] = useState();
    const [clear, setClear] = useState(false);
    const types = ['User', 'Admin', 'Blocked'].map(
        item => ({ label: item, value: item })
    );
    const [selectedUsers, setSelectedUsers] = useState([]);
    useEffect(() => {
        
        const getUsers = async () => {
            const users = await getRequest('/getAllUsers');
            const newUsers = users.map((user) => ({ ...user, userType: "user" }));
            const arrayAdmin = stringToArray(admin);
            const arrayBlocked = stringToArray(blocked);
            const updatedAdminUsers = newUsers.map((user) => arrayAdmin.includes(user.id.toString()) ? {...user,userType:"Admin"}:{...user});
            const updatedBlockedUsers = updatedAdminUsers.map((user) => arrayBlocked.includes(user.id.toString()) ? {...user,userType:"Blocked"}:{...user});
            setAllUsers(updatedBlockedUsers);
        }
        getUsers();
    }, [user.id])
    const changeSelectedUsers = (selected) => {
        setSelectedUsers(selected.selectedRows);
    }
    const stringToArray = (stringArray) => {
        if (!stringArray) return [];
        if (stringArray.includes(',')) {
            return stringArray.split(',');
        }
        return [stringArray];
    }
    const changeUserType = () => {
        if (!selectedType) return alert("Please select an user type")
        const updatedUsers = selectedUsers.map((selectedUser) => ({ ...selectedUser, userType: selectedType }));
        const newUsers = allUsers.map(user => {
            const updatedUser = updatedUsers.find(u => u.id === user.id);
            return updatedUser ? updatedUser : user;
        });
        setClear(!clear)
        setAllUsers(newUsers);
        const admin = newUsers.filter(user => user.userType === "Admin");
        const adminIds = admin.map(admin => admin.id);
        setAdmin(adminIds.join(','));
        const blocked = newUsers.filter(user => user.userType === "Blocked");
        const blockedIds = blocked.map(admin => admin.id);
        setBlocked(blockedIds.join(','));
    }
    const columns = [
        {
            name: 'Username',
            selector: row => row.name,
            sortable: true,
            grow: 2
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            grow: 2
        },
        {
            name: 'User Type',
            selector: row => row.userType,
            sortable: true,
            grow: 1
        },
    ];
    return (
        <div>
            <Text className="text-bold m-2 p-2" size={'lg'} align="center">Users</Text>
            <HStack>
                <SelectPicker data={types} defaultValue={selectedType} onChange={setSelectedType} searchable={false} style={{ width: 224 }} placeholder="User type" />
                <Button onClick={changeUserType}>Change privileges</Button>
            </HStack>
            <DataTable
                selectableRows
                onSelectedRowsChange={changeSelectedUsers}
                columns={columns}
                data={allUsers}
                clearSelectedRows={clear}
                theme={theme}
            />
        </div>
    );
}

export default AdminTable;