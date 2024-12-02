import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFilters } from "../../contexts/useData";
import { raxiosFetchData } from "../../services/fetchData";
import GetColumnSearchProps from "../../Utils/antTableHelper";
import { formatDate } from "../../Utils/formatHelper";
import { Button, Checkbox, Table } from "antd";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import UpsertOfferForm from "../../components/UpsertOfferForm";

const OffersTab = () => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const [offer, setOffer] = useState(null);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalOffers, setTotalOffers] = useState(0);
    const [reqExpired, setReqExpired] = useState(false);
    const [offersPageSize, setOffersPageSize] = useState(10);
    const [offersPage, setOffersPage] = useState(
        localStorage.getItem('offersPage') ? parseInt(localStorage.getItem('offersPage')) : 1
    );
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        raxiosFetchData(offersPage, offersPageSize, setOffers, setTotalOffers, '/actions/upsert_offer', { ...filter, include_expired: reqExpired }, setLoading);
        // eslint-disable-next-line
    }, [offersPage, offersPageSize, JSON.stringify(filter), reqExpired]);

    const createColumn = (title, dataIndex, key, render, width, filter = true) => {
        return {
            title,
            dataIndex,
            key,
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
            ...(render && { render }),
            ...(width && { width }),
        };
    };

    const columns = [
        createColumn('Title', 'title', 'title'),
        createColumn('Coupon Code', 'couponCode', 'couponCode'),
        createColumn('Offer Type', 'offer_type', 'offer_type'),
        createColumn('Expiry', 'validTill', 'validTill', (date) => date ? formatDate(date) : '', null, false),
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) =>
                <Button type="primary" onClick={() => setOffer(record)}>Edit</Button>,
        }
    ]

    return (
        <div className='min-h-screen p-5 w-full overflow-auto flex lg:flex-row flex-col h-max '>
            <div className='flex flex-col gap-2 lg:w-2/3 mr-2'>
                <div className="flex w-full justify-end">
                    <Checkbox
                        checked={reqExpired}
                        onChange={(e) => setReqExpired(e.target.checked)}
                    >
                        Show Expired Offers
                    </Checkbox>
                </div>
                <LazyLoad>
                    {loading ? <Loading /> : <Table
                        dataSource={offers}
                        columns={columns}
                        rowKey={(record) => record._id}
                        pagination={{
                            current: offersPage,
                            pageSize: offersPageSize,
                            total: totalOffers,
                            onChange: (current, pageSize) => {
                                setOffersPage(current);
                                localStorage.setItem('offersPage', current);
                                setOffersPageSize(pageSize);
                            },
                        }}
                    />}
                </LazyLoad>
            </div>
            <div className='flex lg:mt-0 mt-5 lg:w-1/3 pl-2 lg:border-l-2 dark:lg:border-lightBlack'>
                <UpsertOfferForm offer={offer} setOffer={setOffer} />
            </div>
        </div>
    )
};

export default OffersTab;