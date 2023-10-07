'use client'

import React, { useEffect, useState } from 'react';
import '../../(view)/admin/adminStyle.css'
import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from '@/app/(view)/admin_layout/sidebar/page';
import AdminHeader from '@/app/(view)/admin_layout/header/page';
import AdminSubHeader from '@/app/(view)/admin_layout/sub_header/page';

const AdminTemplate = ({ children }) => {

    $(document).ready(function () {
        $("#customSidebarToggle").on('click', function () {
            $('.custom-sidebar, .custom-content').toggleClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        });
    });
    
    const [isSidebarActive, setSidebarActive] = useState(false);
    const toggleSidebar = () => {
        setSidebarActive(!isSidebarActive);
    };


    useEffect(() => {
        const jQueryScript = document.createElement('script');
        jQueryScript.src = 'https://code.jquery.com/jquery-3.3.1.slim.min.js';
        jQueryScript.integrity = 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo';
        jQueryScript.crossOrigin = 'anonymous';
        jQueryScript.async = true;
        document.body.appendChild(jQueryScript);

        const bootstrapScript = document.createElement('script');
        bootstrapScript.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js';
        bootstrapScript.integrity = 'sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm';
        bootstrapScript.crossOrigin = 'anonymous';
        bootstrapScript.async = true;
        document.body.appendChild(bootstrapScript);

        return () => {

            document.body.removeChild(jQueryScript);
            document.body.removeChild(bootstrapScript);
        };
    }, []);


    return (
        <div>

            <div class="wrapper" className={`wrapper ${isSidebarActive ? 'sidebar-active' : ''} `} >
                <AdminSidebar isSidebarActive={isSidebarActive}></AdminSidebar>

                <div id="content" className='w-100'>
                    <AdminHeader  toggleSidebar={toggleSidebar}></AdminHeader>
                    <AdminSubHeader className="sticky-top"></AdminSubHeader>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminTemplate;