import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import LazyLoad from '../components/LazyLoad/lazyload';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { useLocation, useParams } from 'react-router-dom';
import EventUsersTable from '../components/EventUsersTable';
import { raxiosFetchData, RaxiosPost } from '../services/fetchData';
import CreateEventPopup from '../components/Popups/CreateEventPopup';
import { useFilters, usePlatformCategories } from '../contexts/useData';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alertDialog";

const EventDetails = ({ contribute }) => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const { slug } = useParams();
    const [data, setData] = useState({});
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const { fetchPlatformCategories } = usePlatformCategories();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const contribute_dict = contribute ? { events_type: 'contribute' } : {};

    const fetchEventDetails = async () => {
        const response = await raxiosFetchData(null, null, null, null, '/actions/list_events', { slug, ...contribute_dict });
        setData(response.data[0]);
    };

    const fetchUsers = async () => await raxiosFetchData(null, null, setUsers, null, '/actions/list_event_users', { slug, ...filter, ...contribute_dict });

    // eslint-disable-next-line
    useEffect(() => { fetchEventDetails(); fetchUsers(); fetchPlatformCategories(); }, [slug, editMode, JSON.stringify(filter)]);

    const toggleEditMode = () => setEditMode(!editMode);
    const DeleteEvent = async () => {
        const response = await RaxiosPost('/actions/upsert_event', { slug, isDeleted: true });
        if (response.status === 200) window.history.back();
    }

    return (
        <LazyLoad>
            <div className="min-h-screen bg-background">
                <div className="max-w-[1400px] mx-auto p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-semibold">Event Details</h1>
                        <Button onClick={() => window.history.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>

                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {!contribute && <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Main Title:</h3>
                                    <p className="text-xl">{data?.mainTitle}</p>
                                </div>}
                                {!contribute && <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Sub Title:</h3>
                                    <p className="text-xl">{data?.subTitle}</p>
                                </div>}
                                <div className='flex gap-10 items-center'>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Name:</h3>
                                        <p className="text-xl">{data?.name}</p>
                                    </div>
                                    {contribute && <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Company:</h3>
                                        <p className="text-xl">{data?.company}</p>
                                    </div>
                                    }
                                </div>
                                {contribute && <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description:</h3>
                                    <p className="text-xl">{data?.description}</p>
                                </div>}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={toggleEditMode}
                                        className="flex items-center gap-2"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit Event Details
                                    </Button>
                                    <Button
                                        danger
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Event
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {!editMode ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
                            <div className="rounded-lg">
                                <EventUsersTable
                                    users={users}
                                    pathname={location.pathname}
                                    contribute={contribute}
                                />
                            </div>
                        </div>
                    ) : (
                        <CreateEventPopup
                            setVisible={setEditMode}
                            data={data}
                            editMode={editMode}
                            contribute={contribute}
                        />
                    )}

                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent className="dark:bg-lightBlack dark:text-white bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the event.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                                <Button onClick={DeleteEvent} danger type='primary' autoFocus>Delete</Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </LazyLoad>
    );
}

export default EventDetails;

