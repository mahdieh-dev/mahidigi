"use client"

import React, { useMemo, useState } from "react"
import {
    Box,
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material"

import DeleteIcon from "@mui/icons-material/Delete"
import FilterListIcon from "@mui/icons-material/FilterList"

import { FaCheckCircle } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"

import { deleteSingleUser } from "@/lib/database/actions/admin/user.actions"
import { changeVerifyTagForVendor } from "@/lib/database/actions/admin/vendor.actions"
import styles from "./table.module.css"

interface VendorRow {
    _id: string
    name: string
    email: string
    image: string
    phoneNumber: string
    zipCode: string
    verified: boolean
}

type Order = "asc" | "desc"

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }

    if (b[orderBy] > a[orderBy]) {
        return 1
    }

    return 0
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string | boolean },
    b: { [key in Key]: number | string | boolean }
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array?.map((el, index) => [el, index] as [T, number])

    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0])

        if (order !== 0) {
            return order
        }

        return a[1] - b[1]
    })

    return stabilizedThis?.map((el) => el[0])
}

const headCells = [
    {
        id: "image",
        numeric: false,
        disablePadding: true,
        label: "Vendor Image",
    },
    {
        id: "name",
        numeric: false,
        disablePadding: false,
        label: "Name",
    },
    {
        id: "email",
        numeric: false,
        disablePadding: false,
        label: "Email",
    },
    {
        id: "phoneNumber",
        numeric: false,
        disablePadding: false,
        label: "Phone Number",
    },
    {
        id: "zipCode",
        numeric: false,
        disablePadding: false,
        label: "Zip Code",
    },
    {
        id: "verified",
        numeric: false,
        disablePadding: false,
        label: "Verified",
    },
    {
        id: "delete",
        numeric: false,
        disablePadding: false,
        label: "Delete",
    },
]

async function deleteHandler(id: string) {
    try {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this vendor?"
        )

        if (!confirmDelete) {
            return
        }

        const response = await deleteSingleUser(id)

        alert(response ?? "Vendor deleted successfully")

        window.location.reload()
    } catch (error: any) {
        console.log(
            error?.message ||
            "An error occurred while deleting vendor and associated products."
        )
    }
}

interface EnhancedTableHeadProps {
    numSelected: number
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof VendorRow) => void
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
    order: Order
    orderBy: string
    rowCount: number
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props

    const createSortHandler = (property: keyof VendorRow) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all vendors",
                        }}
                    />
                </TableCell>

                {headCells?.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{
                            backgroundColor: "#006d8f",
                            color: "white",
                            fontWeight: 700,
                        }}
                    >
                        {headCell.id === "delete" || headCell.id === "verified" ? (
                            headCell.label
                        ) : (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : "asc"}
                                onClick={createSortHandler(headCell.id as keyof VendorRow)}
                                sx={{
                                    color: "white !important",
                                    "& .MuiTableSortLabel-icon": {
                                        color: "white !important",
                                    },
                                }}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

function EnhancedTableToolbar({ numSelected }: { numSelected: number }) {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: "rgba(25, 118, 210, 0.08)",
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Users
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    )
}

function EnhancedTableVendors({ rows }: { rows: VendorRow[] }) {
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<keyof VendorRow>("name")
    const [selected, setSelected] = useState<readonly string[]>([])
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loadingVendorId, setLoadingVendorId] = useState<string | null>(null)

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof VendorRow
    ) => {
        const isAsc = orderBy === property && order === "asc"

        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows?.map((n) => n.name)
            setSelected(newSelected)
            return
        }

        setSelected([])
    }

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected: readonly string[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected?.slice(1))
        } else if (selectedIndex === selected?.length - 1) {
            newSelected = newSelected.concat(selected?.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected?.slice(0, selectedIndex),
                selected?.slice(selectedIndex + 1)
            )
        }

        setSelected(newSelected)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleVendorVerify = async (
        vendorId: string,
        verified: boolean
    ) => {
        try {
            setLoadingVendorId(vendorId)

            const response = await changeVerifyTagForVendor(vendorId, verified)

            alert(response?.message)

            window.location.reload()
        } catch (error: any) {
            console.log(error?.message)
        } finally {
            setLoadingVendorId(null)
        }
    }

    const isSelected = (name: string) => selected.indexOf(name) !== -1

    const visibleRows = useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy))?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, rows]
    )

    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - rows?.length)
            : 0

    return (
        <div>
            <h1 className="font-bold text-2xl mb-4">
                Total Vendors - {rows?.length}
            </h1>

            <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                    <EnhancedTableToolbar numSelected={selected?.length} />

                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? "small" : "medium"}
                            className={styles.table}
                        >
                            <EnhancedTableHead
                                numSelected={selected?.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows?.length}
                            />

                            <TableBody>
                                {visibleRows?.map((row, index) => {
                                    const isItemSelected = isSelected(row.name)
                                    const labelId = `enhanced-table-checkbox-${index}`

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.name)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row._id}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby": labelId,
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                sx={{ py: 1 }}
                                            >
                                                <img
                                                    src={row.image}
                                                    alt={row.name}
                                                    className={styles.table__img}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        objectFit: "cover",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell align="left">{row.name}</TableCell>

                                            <TableCell align="left">{row.email}</TableCell>

                                            <TableCell align="left">
                                                {row.phoneNumber}
                                            </TableCell>

                                            <TableCell align="left">{row.zipCode}</TableCell>

                                            <TableCell align="left">
                                                {row.verified ? (
                                                    <FaCheckCircle
                                                        color="green"
                                                        size={28}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()

                                                            if (loadingVendorId) return

                                                            handleVendorVerify(row._id, false)
                                                        }}
                                                    />
                                                ) : (
                                                    <IoMdCloseCircle
                                                        color="red"
                                                        size={30}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()

                                                            if (loadingVendorId) return

                                                            handleVendorVerify(row._id, true)
                                                        }}
                                                    />
                                                )}
                                            </TableCell>

                                            <TableCell align="left">
                                                <DeleteIcon
                                                    style={{
                                                        color: "#111",
                                                        cursor: "pointer",
                                                        fontSize: 24,
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteHandler(row._id)
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}

                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={8} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </div>
    )
}

export default EnhancedTableVendors