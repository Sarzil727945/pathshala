const connection = require('../../../connection/config/database')
const AdminPageListModel = {
    getAllAdminPageList: async (req, res) => {
        try {
            const data = "select * from 	admin_page_list";
            connection.query(data, function (error, result) {
                console.log(result)
                if (!error) {
                    res.send(result)
                }

                else {
                    console.log(error)
                }

            })
        }
        catch (error) {
            console.log(error)
        }
    },




    createAllAdminPageList: async (req, res) => {
        const {
            controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,
        } = req.body;

        // SQL query to delete previous records with the same controller_name
        const deleteQuery = 'DELETE FROM admin_page_list WHERE controller_name = ?';

        // SQL query to insert a new record
        const insertQuery = `INSERT INTO admin_page_list (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Function to convert snake_case to Title Case
        const titleCaseWord = (word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        };

        // Convert controller_name to display_name
        const display_name = controller_name?.split("_")
            .map(word => titleCaseWord(word))
            .join(" ");

        // SQL query to retrieve max controller_sort and page_group_sort values
        const maxValuesQuery = `
            SELECT 
                MAX(controller_sort) AS max_controller_sort, 
                MAX(page_group_sort) AS max_page_group_sort
            FROM admin_page_list
            WHERE page_group = ?
        `;

        connection.query(maxValuesQuery, [page_group], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to retrieve max values.' });
            }

            const maxControllerSort = result[0].max_controller_sort || 0;
            const maxPageGroupSort = result[0].max_page_group_sort || 0;

            const controller_sort = maxControllerSort + 1;
            const page_group_sort = maxPageGroupSort + 1;

            connection.query(deleteQuery, [controller_name], (deleteError, deleteResult) => {
                if (deleteError) {
                    console.log(deleteError);
                    return res.status(500).json({ message: 'Failed to delete previous records.' });
                }

                connection.query(insertQuery, [display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status], (insertError, insertResult) => {
                    if (insertError) {
                        console.log(insertError);
                        return res.status(500).json({ message: 'Failed to add product.' });
                    }

                    const parent_id = insertResult.insertId;

                    const childRecords = [
                        { display_name: display_name + ' Create', method_name: controller_name + '_create' },
                        { display_name: display_name + ' Copy', method_name: controller_name + '_copy' },
                        { display_name: display_name + ' Edit', method_name: controller_name + '_edit' },
                        { display_name: display_name + ' Delete', method_name: controller_name + '_delete' },
                        { display_name: display_name + ' List', method_name: controller_name + '_all' },
                    ];

                    // Function to insert child records
                    const insertChildRecords = (index) => {
                        if (index >= childRecords.length) {
                            // All child records inserted
                            return res.send(insertResult);
                        }

                        const childRecord = childRecords[index];

                        connection.query(insertQuery, [childRecord.display_name, controller_name, childRecord.method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status], (childInsertError, childInsertResult) => {
                            if (childInsertError) {
                                console.log(childInsertError);
                                return res.status(500).json({ message: 'Failed to add product.' });
                            }

                            // Insert the next child record
                            insertChildRecords(index + 1);
                        });
                    };

                    // Start inserting child records
                    insertChildRecords(0);
                });
            });
        });
    },



    // original

    //     createAllAdminPageList: async (req, res) => {

    //         const { controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status, } = req.body;

    //         // SQL query to delete previous records with the same controller_name
    //         const deleteQuery = 'DELETE FROM admin_page_list WHERE controller_name = ?';

    //         // SQL query to insert a new record
    //         const insertQuery = `INSERT INTO admin_page_list (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


    //         function titleCaseWord(word) {
    //             return word.charAt(0).toUpperCase() + word.slice(1);
    //         }
    //         const display_name = controller_name
    //             .split("_")
    //             .map(word => titleCaseWord(word))
    //             .join(" ");


    //         const maxValuesQuery = `
    //   SELECT 
    //     MAX(controller_sort) AS max_controller_sort, 
    //     MAX(page_group_sort) AS max_page_group_sort
    //   FROM admin_page_list
    //   WHERE page_group = ?
    // `;

    //         connection.query(maxValuesQuery, [page_group], (error, result) => {
    //             if (error) {
    //                 console.log(error);
    //                 return res.status(500).json({ message: 'Failed to retrieve max values.' });
    //             }

    //             // `result` will contain the maximum values for controller_sort and page_group_sort
    //             const maxControllerSort = result[0].max_controller_sort;
    //             const maxPageGroupSort = result[0].max_page_group_sort;

    //             const controller_sort = maxControllerSort + 1;
    //             const page_group_sort = maxPageGroupSort + 1;

    //             connection.query(deleteQuery, [controller_name], (deleteError, deleteResult) => {
    //                 if (deleteError) {
    //                     console.log(deleteError);
    //                     return res.status(500).json({ message: 'Failed to delete previous records.' });
    //                 }
    //                 connection.query(insertQuery, [display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status],
    //                     (error, result) => {
    //                         if (error) {
    //                             console.log(error);
    //                             return res.status(500).json({ message: 'Failed to add product.' });
    //                         }

    //                         const parent_id = result.insertId;
    //                         const display_name_cr = display_name + ' Create';
    //                         const method_name_cr = controller_name + '_create';
    //                         const display_name_c = display_name + ' Copy';
    //                         const method_name_c = controller_name + '_copy';
    //                         const display_name_e = display_name + ' Edit';
    //                         const method_name_e = controller_name + '_edit';
    //                         const display_name_d = display_name + ' Delete';
    //                         const method_name_d = controller_name + '_delete';
    //                         const display_name_a = display_name + '  List';
    //                         const method_name_a = controller_name + '_all';

    //                         // Children create part start
    //                         connection.query(insertQuery, [display_name_cr, controller_name, method_name_cr, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
    //                             (error, result) => {
    //                                 if (error) {
    //                                     console.log(error);
    //                                     return res.status(500).json({ message: 'Failed to add product.' });
    //                                 }
    //                                 // console.log(result);
    //                                 // Continue with other queries if needed
    //                             }
    //                         );
    //                         // Children create part end

    //                         // Children Copy part start
    //                         connection.query(insertQuery, [display_name_c, controller_name, method_name_c, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
    //                             (error, result) => {
    //                                 if (error) {
    //                                     console.log(error);
    //                                     return res.status(500).json({ message: 'Failed to add product.' });
    //                                 }
    //                                 // console.log(result);
    //                                 // Continue with other queries if needed
    //                             }
    //                         );
    //                         // Children Copy part end

    //                         // Children Edit part start
    //                         connection.query(insertQuery, [display_name_e, controller_name, method_name_e, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
    //                             (error, result) => {
    //                                 if (error) {
    //                                     console.log(error);
    //                                     return res.status(500).json({ message: 'Failed to add product.' });
    //                                 }
    //                                 // console.log(result);
    //                                 // Continue with other queries if needed
    //                             }
    //                         );
    //                         // Children Edit part end

    //                         // Children Delete part start
    //                         connection.query(insertQuery, [display_name_d, controller_name, method_name_d, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
    //                             (error, result) => {
    //                                 if (error) {
    //                                     console.log(error);
    //                                     return res.status(500).json({ message: 'Failed to add product.' });
    //                                 }
    //                                 // console.log(result);
    //                                 // Continue with other queries if needed
    //                             }
    //                         );
    //                         // Children Delete part end

    //                         // Children All part start
    //                         connection.query(insertQuery, [display_name_a, controller_name, method_name_a, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
    //                             (error, result) => {
    //                                 if (error) {
    //                                     console.log(error);
    //                                     return res.status(500).json({ message: 'Failed to add product.' });
    //                                 }
    //                                 // console.log(result);
    //                                 // Continue with other queries if needed
    //                             }
    //                         );
    //                         // Children All part end


    //                         // Continue with other queries if needed

    //                         return res.send(result);
    //                     }
    //                 );
    //             })
    //         });
    //     },






    // createAllAdminPageList: async (req, res) => {
    //     try {

    //         const { display_name, controller_name, method_name,  menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status } = req.body;

    //         const query = 'INSERT INTO admin_page_list (display_name, controller_name, method_name,  menu_type, icon, btn, default_page,  page_group, page_group_icon, controller_sort,  page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    //         connection.query(query, [display_name, controller_name, method_name,  menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status], (error, result) => {
    //             if (!error) {
    //                 console.log(result, 'get data');
    //                 return res.send(result);
    //             } else {
    //                 console.log(error);
    //                 return res.status(500).json({ message: 'Failed to add product.' });
    //             }
    //         });



    //     }
    //     catch (error) {
    //         console.log(error)
    //     }

    // },

    getSingleAdminPageList: async (req, res) => {
        try {
            const query = 'SELECT * FROM admin_page_list WHERE id = ?';
            connection.query(query, [req.params.id], (error, result) => {
                if (!error && result.length > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || 'Product not found');
                    return res.status(404).json({ message: 'Product not found.' });
                }
            });
        }
        catch (error) {
            console.log(error)
        }
    },
    // email/email?=admin@gmail.com
    getSingleAdminPageListEmail: async (req, res) => {
        try {
            const { email } = req.query
            const query = 'SELECT * FROM users WHERE email = ?';
            connection.query(query, [email], (error, result) => {
                if (!error && result.length > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || 'Product not found');
                    return res.status(404).json({ message: 'Product not found.' });
                }
            });
        }
        catch (error) {
            console.log(error)
        }
    },

    deleteSingleAdminPageList: async (req, res) => {
        try {
            const query = 'DELETE FROM admin_page_list WHERE id = ?';
            connection.query(query, [req.params.id], (error, result) => {
                if (!error && result.affectedRows > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || 'Product not found');
                    return res.status(404).json({ message: 'Product not found.' });
                }
            });
        }
        catch (error) {
            console.log(error)
        }
    },


}


module.exports = AdminPageListModel