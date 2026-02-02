import { Fragment, useCallback, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import DataTable from "react-data-table-component";
import differenceBy from "lodash/differenceBy";
import { nanoid } from "nanoid";

export const COLUMNS = [
    {
        Header: "Name",
        accessor: "Name",
    },
    {
        Header: "Position",
        accessor: "Position",
    },
    {
        Header: "Office",
        accessor: "Office",
    },
    {
        Header: "Age",
        accessor: "Age",
    },
    {
        Header: "Start date",
        accessor: "date",
    },
    {
        Header: "Salary",
        accessor: "Salary",
    },
];

export const DATATABLE = [
    {
        Id: "1",
        Name: "Tiger Nixon",
        Position: "System Architect",
        Office: "Edinburgh",
        Age: "61",
        date: '2011-04-25',
        Salary: "$320,800",
    },
    {
        Id: "2",
        Name: "Garrett Winters",
        Position: "Accountant",
        Office: "Tokyo",
        Age: "63",
        date: '2011-07-25',
        Salary: "$170,750",
    },
    {
        Id: "3",
        Name: "Ashton Cox",
        Position: "Junior Technical Author",
        Office: "San Francisco",
        Age: "66",
        date: '2009-01-12',
        Salary: "$86,000",
    },
    {
        Id: "4",
        Name: "Cedric Kelly",
        Position: "Senior Javascript Developer",
        Office: "Edinburgh",
        Age: "22",
        date: '2012-03-29',
        Salary: "$433,060",
    },
    {
        Id: "5",
        Name: "Airi Satou",
        Position: "Accountant",
        Office: "Tokyo",
        Age: "33",
        date: '2010-10-14',
        Salary: "$162,700",
    },
    {
        Id: "6",
        Name: "Brielle Williamson",
        Position: "Integration Specialist",
        Office: "New York",
        Age: "61",
        date: '2009-09-15',
        Salary: "$372,000",
    },
    {
        Id: "7",
        Name: "Herrod Chandler",
        Position: "Sales Assistant",
        Office: "San Francisco",
        Age: "59",
        date: '2008-12-13',

        Salary: "$137,500",
    },

    {
        Id: "8",
        Name: "Rhona Davidson",
        Position: "Integration Specialist",
        Office: "Tokyo",
        Age: "55",
        date: '2008-12-19',
        Salary: "$327,900",
    },
    {
        Id: "9",
        Name: "Colleen Hurst",
        Position: "Javascript Developer",
        Office: "San Francisco",
        Age: "39",
        date: '2013-03-03',
        Salary: "$205,500",
    },
    {
        Id: "10",
        Name: "Sonya Frost",
        Position: "Software Engineer",
        Office: "Edinburgh",
        Age: "23",
        date: '2013-03-03',
        Salary: "$103,600",
    },
    {
        Id: "11",
        Name: "Jena Gaines",
        Position: "Office Manager",
        Office: "London",
        Age: "30",
        date: '2008-10-16',
        Salary: "$90,560",
    },
    {
        Id: "12",
        Name: "Quinn Flynn",
        Position: "Support Lead",
        Office: "Edinburgh",
        Age: "22",
        date: '2012-12-18',
        Salary: "$342,000",
    },
    {
        Id: "13",
        Name: "Charde Marshall",
        Position: "Regional Director",
        Office: "San Francisco",
        Age: "36",
        date: '2010-06-09',
        Salary: "$470,600",
    },
    {
        Id: "14",
        Name: "Haley Kennedy",
        Position: "Senior Marketing Designer",
        Office: "London",
        Age: "43",
        date: '2009-04-10',
        Salary: "$313,500",
    },
    {
        Id: "15",
        Name: "Tatyana Fitzpatrick",
        Position: "Regional Director",
        Office: "London",
        Age: "19",
        date: '2012-10-13',
        Salary: "$385,750",
    },
    {
        Id: "16",
        Name: "Michael Silva",
        Position: "Marketing Designer",
        Office: "London",
        Age: "66",
        date: '2012-09-26',
        Salary: "$198,500",
    },
    {
        Id: "17",
        Name: "Paul Byrd",
        Position: "Chief Financial Officer (CFO)",
        Office: "New York",
        Age: "64",
        date: '2011-09-03',
        Salary: "$725,000",
    },
    {
        Id: "18",
        Name: "Gloria Little",
        Position: "Systems Administrator",
        Office: "New York",
        Age: "59",
        date: '2009-06-25',
        Salary: "$237,500",
    },
    {
        Id: "19",
        Name: "Bradley Greer",
        Position: "Software Engineer",
        Office: "London",
        Age: "41",
        date: '2011-12-12',
        Salary: "$132,000",
    },
    {
        Id: "20",
        Name: "Dai Rios",
        Position: "Personnel Lead",
        Office: "Edinburgh",
        Age: "35",
        date: '2010-09-20',
        Salary: "$217,500",
    },
    {
        Id: "21",
        Name: "Jenette Caldwell",
        Position: "Development Lead",
        Office: "New York",
        Age: "30",
        date: '2009-10-09',
        Salary: "$345,000",
    },
    {
        Id: "22",
        Name: "Yuri Berry",
        Position: "Chief Marketing Officer (CMO)",
        Office: "New York",
        Age: "40",
        date: '2010-12-22',
        Salary: "$675,000",
    },
    {
        Id: "23",
        Name: "Caesar Vance",
        Position: "Pre-Sales Support",
        Office: "New York",
        Age: "21",
        date: '2010-11-14',
        Salary: "$106,450",
    },
    {
        Id: "24",
        Name: "Doris Wilder",
        Position: "Sales Assistant",
        Office: "Sidney",
        Age: "23",
        date: '2011-06-07',
        Salary: "$85,600",
    },
    {
        Id: "25",
        Name: "Angelica Ramos",
        Position: "Chief Executive Officer (CEO)",
        Office: "London",
        Age: "47",
        date: '2010-03-11',
        Salary: "$1,200,000",
    },
    {
        Id: "26",
        Name: "Gavin Joyce",
        Position: "Developer",
        Office: "Edinburgh",
        Age: "42",
        date: '2011-08-14',
        Salary: "$92,575",
    },
    {
        Id: "27",
        Name: "Jennifer Chang",
        Position: "Regional Director",
        Office: "Singapore",
        Age: "28",
        date: '2011-05-07',
        Salary: "$357,650",
    },
    {
        Id: "28",
        Name: "Brenden Wagner",
        Position: "Software Engineer",
        Office: "San Francisco",
        Age: "28",
        date: '2011-08-14',
        Salary: "$206,850",
    },
    {
        Id: "29",
        Name: "Fiona Green",
        Position: "Chief Operating Officer (COO)",
        Office: "San Francisco",
        Age: "48",
        date: '2009-10-09',
        Salary: "$850,000",
    },
    {
        Id: "30",
        Name: "Shou Itou",
        Position: "Regional Marketing",
        Office: "Tokyo",
        Age: "20",
        date: '2011-09-03',
        Salary: "$163,000",
    },
    {
        Id: "31",
        Name: "Michelle House",
        Position: "Integration Specialist",
        Office: "Sidney",
        Age: "37",
        date: '2011-04-25',
        Salary: "$95,400",
    },
    {
        Id: "32",
        Name: "Suki Burks",
        Position: "Developer",
        Office: "London",
        Age: "53",
        date: '2012-11-27',
        Salary: "$114,500",
    },
    {
        Id: "33",
        Name: "Prescott Bartlett",
        Position: "Technical Author",
        Office: "London",
        Age: "27",
        date: '2009-06-25',
        Salary: "$145,000",
    },
    {
        Id: "34",
        Name: "Gavin Cortez",
        Position: "Team Leader",
        Office: "San Francisco",
        Age: "22",
        date: '2008-11-13',
        Salary: "$235,500",
    },
    {
        Id: "35",
        Name: "Martena Mccray",
        Position: "Post-Sales support",
        Office: "Edinburgh",
        Age: "46",
        date: '2013-02-01',
        Salary: "$324,050",
    },
    {
        Id: "36",
        Name: "Unity Butler",
        Position: "Marketing Designer",
        Office: "San Francisco",
        Age: "47",
        date: '2012-09-26',
        Salary: "$85,675",
    },
    {
        Id: "37",
        Name: "Howard Hatfield",
        Position: "Office Manager",
        Office: "San Francisco",
        Age: "51",
        date: '2011-06-02',
        Salary: "$164,500",
    },
    {
        Id: "38",
        Name: "Hope Fuentes",
        Position: "Secretary",
        Office: "San Francisco",
        Age: "41",
        date: '2008-10-26',
        Salary: "$109,850",
    },
    {
        Id: "39",
        Name: "Vivian Harrell",
        Position: "Financial Controller",
        Office: "San Francisco",
        Age: "62",
        date: '2009-02-14',

        Salary: "$452,500",
    },
    {
        Id: "40",
        Name: "Timothy Mooney",
        Position: "Office Manager",
        Office: "London",
        Age: "37",
        date: '2008-12-16',
        Salary: "$136,200",
    },
    {
        Id: "41",
        Name: "Jackson Bradshaw",
        Position: "Director",
        Office: "New York",
        Age: "65",
        date: '2009-10-22',
        Salary: "$645,750",
    },
    {
        Id: "42",
        Name: "Olivia Liang",
        Position: "Support Engineer",
        Office: "Singapore",
        Age: "64",
        date: '2009-10-22',
        Salary: "$234,500",
    },
    {
        Id: "43",
        Name: "Bruno Nash",
        Position: "Software Engineer",
        Office: "London",
        Age: "38",
        date: '2008-12-11',

        Salary: "$163,500",
    },
    {
        Id: "44",
        Name: "Sakura Yamamoto",
        Position: "Support Engineer",
        Office: "Tokyo",
        Age: "37",
        date: '2010-03-11',
        Salary: "$139,575",
    },
    {
        Id: "45",
        Name: "Thor Walton",
        Position: "Developer",
        Office: "New York",
        Age: "61",
        date: '2011-05-07',
        Salary: "$98,540",
    },
    {
        Id: "46",
        Name: "Finn Camacho",
        Position: "Support Engineer",
        Office: "San Francisco",
        Age: "47",
        date: '2009-10-22',

        Salary: "$87,500",
    },
    {
        Id: "47",
        Name: "Serge Baldwin",
        Position: "Data Coordinator",
        Office: "Singapore",
        Age: "64",
        date: '2008-10-26',
        Salary: "$138,575",
    },
    {
        Id: "48",
        Name: "Zenaida Frank",
        Position: "Software Engineer",
        Office: "New York",
        Age: "63",
        date: '2009-10-09',

        Salary: "$125,250",
    },
    {
        Id: "49",
        Name: "Zorita Serrano",
        Position: "Software Engineer",
        Office: "San Francisco",
        Age: "56",
        date: '2011-05-07',
        Salary: "$115,000",
    },
    {
        Id: "50",
        Name: "Jennifer Acosta",
        Position: "Junior Javascript Developer",
        Office: "Edinburgh",
        Age: "43",
        date: '2011-06-07',
        Salary: "$75,650",
    },
    {
        Id: "51",
        Name: "Cara Stevens",
        Position: "Sales Assistant",
        Office: "New York",
        Age: "46",
        date: '2009-02-14',

        Salary: "$145,600",
    },
    {
        Id: "52",
        Name: "Hermione Butler",
        Position: "Regional Director",
        Office: "London",
        Age: "47",
        date: '2011-03-09',

        Salary: "$356,250",
    },
    {
        Id: "53",
        Name: "Lael Greer",
        Position: "Systems Administrator",
        Office: "London",
        Age: "21",
        date: '2009-02-14',

        Salary: "$103,500",
    },
    {
        Id: "54",
        Name: "Jonas Alexander",
        Position: "Developer",
        Office: "San Francisco",
        Age: "30",
        date: '2011-12-06',

        Salary: "$86,500",
    },
    {
        Id: "55",
        Name: "Shad Decker",
        Position: "Regional Director",
        Office: "Edinburgh",
        Age: "51",
        date: '2011-03-21',

        Salary: "$183,000",
    },
    {
        Id: "56",
        Name: "Michael Bruce",
        Position: "Javascript Developer",
        Office: "Singapore",
        Age: "29",
        date: '2009-02-27',

        Salary: "$183,000",
    },
    {
        Id: "57",
        Name: "Donna Snider",
        Position: "Customer Support",
        Office: "New York",
        Age: "27",
        date: '2010-07-14',
        Salary: "$112,000",
    },
    {
        Id: "58",
        Name: "Fiona Green",
        Position: "Chief Operating Officer (COO)",
        Office: "San Francisco",
        Age: "48",
        date: '2008-11-13',
        Salary: "$850,000",
    },
    {
        Id: "59",
        Name: "Shou Itou",
        Position: "Regional Marketing",
        Office: "Tokyo",
        Age: "20",
        date: '2011-06-27',
        Salary: "$163,000",
    },
    {
        Id: "60",
        Name: "Prescott Bartlett",
        Position: "Technical Author",
        Office: "London",
        Age: "27",
        date: '2011-01-25',
        Salary: "$145,000",
    },
];

export const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <span className="d-flex ms-auto">
            <input
                value={filter || ""}
                onChange={(e) => setFilter(e.target.value)}
                className="form-control mb-4"
                placeholder="Search..."
            />
        </span>
    );
};

export const BasicTable = () => {
    const tableInstance = useTable(
        {
            columns: COLUMNS,
            data: DATATABLE,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps, // table props from react-table
        headerGroups, // headerGroups, if your table has groupings
        getTableBodyProps, // table body props from react-table
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        state,
        setGlobalFilter,
        page, // use, page or rows
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
    } = tableInstance;

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <>
            <div className="d-flex">
                <select
                    className=" mb-4 selectpage border me-1"
                    value={pageSize}
                    onChange={(e) => setPageSize((e.target.value))}
                >
                    {[10, 25, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>
            <table {...getTableProps()} className="table table-hover mb-0 table-bordered">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={column.className} key={Math.random()}
                                >
                                    <span className="tabletitle">{column.render("Header")}</span>
                                    <span className="float-end">
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <i className="fa fa-angle-down"></i>
                                            ) : (
                                                <i className="fa fa-angle-up"></i>
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={Math.random()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td className="borderrigth" {...cell.getCellProps()} key={Math.random()}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="d-block d-sm-flex mt-4 ">
                <span className="">
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </span>
                <span className="ms-sm-auto ">
                    <Button
                        variant=""
                        className="btn-outline-light tablebutton me-2 d-sm-inline d-block my-1"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {" Previous "}
                    </Button>
                    <Button
                        variant=""
                        className="btn-outline-light tablebutton me-2 my-1"
                        onClick={() => {
                            previousPage();
                        }}
                        disabled={!canPreviousPage}
                    >
                        {" << "}
                    </Button>
                    <Button
                        variant=""
                        className="btn-outline-light tablebutton me-2 my-1"
                        onClick={() => {
                            previousPage();
                        }}
                        disabled={!canPreviousPage}
                    >
                        {" < "}
                    </Button>
                    <Button
                        variant=""
                        className="btn-outline-light tablebutton me-2 my-1"
                        onClick={() => {
                            nextPage();
                        }}
                        disabled={!canNextPage}
                    >
                        {" > "}
                    </Button>
                    <Button
                        variant=""
                        className="btn-outline-light tablebutton me-2 my-1"
                        onClick={() => {
                            nextPage();
                        }}
                        disabled={!canNextPage}
                    >
                        {" >> "}
                    </Button>
                    <Button
                        variant=""
                        className="btn-outline-light tablebutton me-2 d-sm-inline d-block my-1"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {" Next "}
                    </Button>
                </span>
            </div>
        </>
    );
};


// ********************************************************************

function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
        let ctr = 0;
        keys.forEach((key) => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];

            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
}

const Export = ({ onExport }) => (
    <Button color="" className="btn btn-primary me-0" onClick={(e) => onExport(e.target.value)}>Export</Button>
);

const data = [
    {
        id: "1",
        SNO: 1,
        NAME: "Yonna",
        LASTNAME: "Qond",
        POSITION: "Financial Controller",
        DATE: "2012/02/21",
        SALARY: "$143,654",
        EMAIL: "i.bond@datatables.net",
    },
    {
        id: "2",
        SNO: 2,
        NAME: "Zonna",
        LASTNAME: "Jond",
        POSITION: "Accountant",
        DATE: "2012/02/21",
        SALARY: "$343,654",
        EMAIL: "a.bond@datatables.net",
    },
    {
        id: "3",
        SNO: 3,
        NAME: "Nonna",
        LASTNAME: "Tond",
        POSITION: "Chief Executive Officer",
        DATE: "2012/02/21",
        SALARY: "$743,654",
        EMAIL: "s.bond@datatables.net",
    },
    {
        id: "4",
        SNO: 4,
        NAME: "Bonna",
        LASTNAME: "Oond",
        POSITION: "Chief Operating Officer",
        DATE: "2012/02/21",
        SALARY: "$643,654",
        EMAIL: "w.bond@datatables.net",
    },
    {
        id: "5",
        SNO: 5,
        NAME: "Honna",
        LASTNAME: "Pond",
        POSITION: "Data Coordinator",
        DATE: "2012/02/21",
        SALARY: "$243,654",
        EMAIL: "e.bond@datatables.net",
    },
    {
        id: "6",
        SNO: 6,
        NAME: "Fonna",
        LASTNAME: "Nond",
        POSITION: "Developer",
        DATE: "2012/02/21",
        SALARY: "$543,654",
        EMAIL: "r.bond@datatables.net",
    },
    {
        id: "7",
        SNO: 7,
        NAME: "Aonna",
        LASTNAME: "Xond",
        POSITION: "Development lead",
        DATE: "2012/02/21",
        SALARY: "$843,654",
        EMAIL: "g.bond@datatables.net",
    },
    {
        id: "8",
        SNO: 8,
        NAME: "Qonna",
        LASTNAME: "Vond",
        POSITION: "Director",
        DATE: "2012/02/21",
        SALARY: "$743,654",
        EMAIL: "x.bond@datatables.net",
    },
    {
        id: "9",
        SNO: 9,
        NAME: "Jond",
        LASTNAME: "Zonna",
        POSITION: "Marketing Officer",
        DATE: "2012/02/21",
        SALARY: "$543,654",
        EMAIL: "k.bond@datatables.net",
    },
    {
        id: "10",
        SNO: 10,
        NAME: "Yonna",
        LASTNAME: "Qond",
        POSITION: "Financial Controller",
        DATE: "2012/02/21",
        SALARY: "$143,654",
        EMAIL: "s.bond@datatables.net",
    },
    {
        id: "11",
        SNO: 11,
        NAME: "Yonna",
        LASTNAME: "Qond",
        POSITION: "Financial Controller",
        DATE: "2012/02/21",
        SALARY: "$143,654",
        EMAIL: "b.bond@datatables.net",
    },
    {
        id: "12",
        SNO: 12,
        NAME: "Yonna",
        LASTNAME: "Qond",
        POSITION: "Financial Controller",
        DATE: "2012/02/21",
        SALARY: "$143,654",
        EMAIL: "o.bond@datatables.net",
    },
    {
        id: "13",
        SNO: 13,
        NAME: "Qonna",
        LASTNAME: "Pond",
        POSITION: "Data Coordinator",
        DATE: "2012/02/21",
        SALARY: "$243,654",
        EMAIL: "q.bond@datatables.net",
    },
    {
        id: "14",
        SNO: 14,
        NAME: "Yonna",
        LASTNAME: "Qond",
        POSITION: "Financial Controller",
        DATE: "2012/02/21",
        SALARY: "$143,654",
        EMAIL: "m.bond@datatables.net",
    },
];

const columns = [
    {
        name: "S.NO",
        selector: (row) => [row.SNO],
        sortable: true,
    },
    {
        name: "NAME",
        selector: (row) => [row.NAME],
        sortable: true,
    },
    {
        name: "LAST NAME",
        selector: (row) => [row.LASTNAME],
        sortable: true,
    },
    {
        name: "POSITION",
        selector: (row) => [row.POSITION],
        sortable: true,
    },
    {
        name: "DATE",
        selector: (row) => [row.DATE],
        sortable: true,
    },
    {
        name: " SALARY",
        selector: (row) => [row.SALARY],
        sortable: true,
    },
    {
        name: "EMAIL",
        selector: (row) => [row.EMAIL],
        sortable: true,
    },
];

export const ExportCSV = () => {
    const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(allData)} />, []);
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    let selectdata = [];
    const [allData, setAllData] = useState(data);
    let allElement2 = [];
    let myfunction = (InputData) => {
        let allElement;
        for (allElement of data) {
            if (allElement.NAME[0] == " ") {
                allElement.NAME = allElement.NAME.trim();
            }
            if (allElement.NAME.toLowerCase().includes(InputData.toLowerCase())) {
                if (allElement.NAME.toLowerCase().startsWith(InputData.toLowerCase())) {
                    allElement2.push(allElement);
                }
            }
        }
        setAllData(allElement2);
    };
    const handleRowSelected = useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);
    const contextActions = useMemo(() => {
        const Selectdata = () => {
            if (window.confirm(`download:\r ${selectedRows.map((r) => r.SNO)}?`)) {
                setToggleCleared(!toggleCleared);
                allData.map((e) => {
                    selectedRows.map((sr) => {
                        if (e.id === sr.id) {
                            selectdata.push(e);
                        }
                        return selectedRows;
                    });
                    return allData;
                });
                downloadCSV(selectdata);
            }
        };

        return <Export onExport={() => Selectdata()} icon="true" />;
    }, [allData, selectdata, selectedRows]);
    return (
        <span className="datatable">
            <Form.Control type="text" placeholder="Search..." className="mb-4 form-control-sm" onChange={(ele) => { myfunction(ele.target.value) }} />
            <DataTable
                columns={columns}
                data={allData}
                actions={actionsMemo}
                contextActions={contextActions}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                selectableRows
                pagination
            />

        </span>
    );
};


// ***************************************************

const tableDataItems = [
    {
        id: "1",
        SNO: 1,
        Name: "Yonna",
        Office: "Qond",
        Position: "Financial Controller",
        Age: "30",
        Salary: "$143,654",
    },
    {
        id: "2",
        SNO: 2,
        Name: "Zonna",
        Office: "Jond",
        Position: "Accountant",
        Age: "22",
        Salary: "$343,654",
    },
    {
        id: "3",
        SNO: 3,
        Name: "Nonna",
        Office: "Tond",
        Position: "Chief Executive Officer",
        Age: "23",
        Salary: "$743,654",
    },
    {
        id: "4",
        SNO: 4,
        Name: "Bonna",
        Office: "Oond",
        Position: "Chief Operating Officer",
        Age: "24",
        Salary: "$643,654",
    },
    {
        id: "5",
        SNO: 5,
        Name: "Honna",
        Office: "Pond",
        Position: "Data Coordinator",
        Age: "25",
        Salary: "$243,654",
    },
    {
        id: "6",
        SNO: 6,
        Name: "Fonna",
        Office: "Nond",
        Position: "Developer",
        Age: "20",
        Salary: "$543,654",
    },
    {
        id: "7",
        SNO: 7,
        Name: "Aonna",
        Office: "Xond",
        Position: "Development lead",
        Age: "30",
        Salary: "$843,654",
    },
    {
        id: "8",
        SNO: 8,
        Name: "Qonna",
        Office: "Vond",
        Position: "Director",
        Age: "90",
        Salary: "$743,654",
    },
    {
        id: "9",
        SNO: 9,
        Name: "Jond",
        Office: "Zonna",
        Position: "Marketing Officer",
        Age: "67",
        Salary: "$543,654",
    },
    {
        id: "10",
        SNO: 10,
        Name: "Yonna",
        Office: "Qond",
        Position: "Financial Controller",
        Age: "65",
        Salary: "$143,654",
    },
    {
        id: "11",
        SNO: 11,
        Name: "Yonna",
        Office: "Qond",
        Position: "Financial Controller",
        Age: "26",
        Salary: "$143,654",
    },
    {
        id: "12",
        SNO: 12,
        Name: "Yonna",
        Office: "Qond",
        Position: "Financial Controller",
        Age: "45",
        Salary: "$143,654",
    },
    {
        id: "13",
        SNO: 13,
        Name: "Qonna",
        Office: "Pond",
        Position: "Data Coordinator",
        Age: "30",
        Salary: "$243,654",
    },
    {
        id: "14",
        SNO: 14,
        Name: "Yonna",
        Office: "Qond",
        Position: "Financial Controller",
        Age: "23",
        Salary: "$143,654",
    },
];

export const ResponsiveDatatable = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);

    const handleRowSelected = useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);

    const columns = [
        {
            name: "S.NO",
            selector: (row) => [row.SNO],
            sortable: true,
        },
        {
            name: "NAME",
            selector: (row) => [row.Name],
            sortable: true,
        },
        {
            name: "LAST NAME",
            selector: (row) => [row.Office],
            sortable: true,
        },
        {
            name: "POSITION",
            selector: (row) => [row.Position],
            sortable: true,
        },
        {
            name: "AGE",
            selector: (row) => [row.Age],
            sortable: true,
        },
        {
            name: " SALARY",
            selector: (row) => [row.Salary],
            sortable: true,
        },
    ];
    const [allData, setAllData] = useState(tableDataItems);
    let allElement2 = [];
    let myfunction = (InputData) => {
        let allElement;
        for (allElement of tableDataItems) {
            if (allElement.Name[0] == " ") {
                allElement.Name = allElement.Name.trim();
            }
            if (allElement.Name.toLowerCase().includes(InputData.toLowerCase())) {
                if (allElement.Name.toLowerCase().startsWith(InputData.toLowerCase())) {
                    allElement2.push(allElement);
                }
            }
        }
        setAllData(allElement2);
    };
    const contextActions = useMemo(() => {
        const handleDelete = () => {
            if (
                window.confirm(
                    `Are you sure you want to delete:\r ${selectedRows.map(
                        (r) => r.SNO
                    )}?`
                )
            ) {
                setToggleCleared(!toggleCleared);
                setAllData(differenceBy(allData, selectedRows, "SNO"));
            }
        };

        return (
            <Button key="delete" color="" onClick={handleDelete}>
                Delete
            </Button>
        );
    }, [allData, selectedRows, toggleCleared]);

    return (
        <span className="datatable deletadd">
            <Form.Label className="float-end">
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    className="mb-4 sm"
                    onChange={(ele) => {
                        myfunction(ele.target.value);
                    }}
                />
            </Form.Label>
            <DataTable
                title
                columns={columns}
                data={allData}
                selectableRows
                contextActions={contextActions}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                pagination
            />
        </span>
    );
};


// **********************************************************
export const Savetable = () => {
    const [modalShow, setModalShow] = useState(false);
    const data = [
        {
            id: 1,
            fullName: "Bella Chloe",
            position: "System Developer",
            start: "2018/03/12",
            salary: "$654,765",
            email: "b.Chloe@datatables.net",
        },
        {
            id: 2,
            fullName: "Donna Bond",
            position: "Account Manager",
            start: "2012/02/21",
            salary: "	$543,654",
            email: "d.bond@datatables.net",
        },
        {
            id: 3,
            fullName: "Harry Carr",
            position: "Technical Manager",
            start: "2011/02/17",
            salary: "$86,000",
            email: "h.carr@datatables.net",
        },
        {
            id: 4,
            fullName: "Lucas Dyer",
            position: "Javascript Developer",
            start: "2014/08/23",
            salary: "$456,123",
            email: "l.dyer@datatables.net",
        },
        {
            id: 5,
            fullName: "Karen Hill",
            position: "Sales Manager",
            start: "2010/7/14",
            salary: "$432,230",
            email: "k.hill@datatables.net",
        },
        {
            id: 6,
            fullName: "Dominic Hudson",
            position: "Sales Assistant",
            start: "2015/10/16",
            salary: "$654,300",
            email: "d.hudson@datatables.net",
        },
    ];
    const [contacts, setContacts] = useState(data);
    const [addFormData, setAddFormData] = useState({
        fullName: "",
        position: "",
        start: "",
        salary: "",
        email: "",
    });

    const [editFormData, setEditFormData] = useState({
        fullName: "",
        position: "",
        start: "",
        salary: "",
        email: "",
    });

    const [editContactId, setEditContactId] = useState(null);

    const handleAddFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;

        setAddFormData(newFormData);
    };

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);
    };
    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const newContact = {
            id: nanoid(),
            fullName: addFormData.fullName,
            position: addFormData.position,
            start: addFormData.start,
            salary: addFormData.salary,
            email: addFormData.email,
        };

        const newContacts = [...contacts, newContact];
        setContacts(newContacts);
        setModalShow(false);
    };

    const handleEditFormSubmit = (event) => {
        event.preventDefault();

        const editedContact = {
            id: editContactId,
            fullName: editFormData.fullName,
            position: editFormData.position,
            start: editFormData.start,
            salary: editFormData.salary,
            email: editFormData.email,
        };

        const newContacts = [...contacts];

        const index = contacts.findIndex((contact) => contact.id === editContactId);

        newContacts[index] = editedContact;

        setContacts(newContacts);
        setEditContactId(null);
    };

    const handleEditClick = (event, contact) => {
        event.preventDefault();
        setEditContactId(contact.id);

        const formValues = {
            fullName: contact.fullName,
            position: contact.position,
            start: contact.start,
            salary: contact.salary,
            email: contact.email,
        };

        setEditFormData(formValues);
    };

    const handleCancelClick = () => {
        setEditContactId(null);
    };

    const handleDeleteClick = (contactId) => {
        const newContacts = [...contacts];

        const index = contacts.findIndex((contact) => contact.id === contactId);

        newContacts.splice(index, 1);

        setContacts(newContacts);
    };

    return (
        <div className="app-container table-responsive">
            <form onSubmit={handleEditFormSubmit}>
                <Button
                    variant=""
                    className="btn btn-primary mb-3"
                    onClick={() => setModalShow(true)}
                >
                    Add New Row
                </Button>
                <table
                    id="delete-datatable"
                    className="table table-bordered text-nowrap border-bottom"
                >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>position</th>
                            <th>Start Date</th>
                            <th>Salary</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <Fragment key={contact.id}>
                                {editContactId === contact.id ? (
                                    <EditableRow
                                        editFormData={editFormData}
                                        handleEditFormChange={handleEditFormChange}
                                        handleCancelClick={handleCancelClick}
                                    />
                                ) : (
                                    <ReadOnlyRow
                                        contact={contact}
                                        handleEditClick={handleEditClick}
                                        handleDeleteClick={handleDeleteClick}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </form>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Add New Row</Modal.Title>
                    <Button
                        variant=""
                        className="btn btn-close"
                        onClick={() => setModalShow(false)}
                    >
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddFormSubmit}>
                        <Form.Control
                            type="text"
                            name="fullName"
                            required
                            placeholder="Enter a name..."
                            onChange={handleAddFormChange}
                            className="mb-2"
                        />
                        <Form.Control
                            type="text"
                            name="position"
                            required
                            placeholder="Enter role..."
                            onChange={handleAddFormChange}
                            className="mb-2"
                        />
                        <Form.Control
                            type="date"
                            name="start"
                            required
                            placeholder="Enter a DOJ..."
                            onChange={handleAddFormChange}
                            className="mb-2"
                        />
                        <Form.Control
                            type="number"
                            name="salary"
                            required
                            placeholder="Enter salary details"
                            onChange={handleAddFormChange}
                            className="mb-2"
                        />
                        <Form.Control
                            type="email"
                            name="email"
                            required
                            placeholder="Enter an email..."
                            onChange={handleAddFormChange}
                            className="mb-2"
                        />
                        <Button variant="" className="btn btn-primary me-2" type="submit">
                            Add
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-primary"
                        onClick={() => setModalShow(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
const EditableRow = ({
    editFormData,
    handleEditFormChange,
    handleCancelClick,
}) => {
    return (
        <tr>
            <td>
                <Form.Control
                    type="text"
                    required
                    placeholder="Enter a name..."
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    required
                    placeholder="Enter an position..."
                    name="position"
                    value={editFormData.position}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    type="date"
                    required
                    placeholder="Enter the DOJ..."
                    name="start"
                    value={editFormData.start}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    required
                    placeholder="Enter start date..."
                    name="salary"
                    value={editFormData.salary}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    type="email"
                    required
                    placeholder="Enter an email..."
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Button variant="" className="btn btn-primary me-1" type="submit">
                    <i className="fe fe-check-circle"> </i>
                </Button>
                <Button
                    variant=""
                    className="btn btn-danger me-1"

                    onClick={handleCancelClick}
                >
                    <i className="fe fe-x-circle"> </i>
                </Button>
            </td>
        </tr>
    );
};
const ReadOnlyRow = ({ contact, handleEditClick, handleDeleteClick }) => {
    return (
        <tr>
            <td>{contact.fullName}</td>
            <td>{contact.position}</td>
            <td>{contact.start}</td>
            <td>{contact.salary}</td>
            <td>{contact.email}</td>
            <td>
                <Button
                    variant=""
                    className="btn btn-primary me-1"
                    type="button"
                    onClick={(event) => handleEditClick(event, contact)}
                >
                    <i className="fe fe-edit"> </i>
                </Button>
                <Button
                    variant=""
                    className="btn btn-danger me-1"
                    type="button"
                    onClick={() => handleDeleteClick(contact.id)}
                >
                    <i className="fe fe-trash-2"> </i>
                </Button>
            </td>
        </tr>
    );
};