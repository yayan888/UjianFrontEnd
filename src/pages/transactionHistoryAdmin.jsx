import React from 'react'
import NavbarMaterial from '../components/navbar'
import Footer from '../components/footer'
import { 
    Table, 
    TableHead, 
    TableRow, 
    TableBody, 
    TableCell, 
    IconButton,
    Collapse,
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    Button,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
} from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error';

import Axios from 'axios'
import {connect} from 'react-redux'
import {History} from '../actions'


class TransactionHistoryAdmin extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            history: [], 
            open: false, 
            selId: null,
            sort: "",
            order:""
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:2000/transaction_history`)
        .then(res => {
            console.log(res.data)

            //invoke action history when we going to transaction admin page
            this.props.History(res.data)
        })
        .catch(err => console.log(err))

    }

    getHistoryData = () =>{
        const { sort, order } = this.state

        Axios.get(`http://localhost:2000/transaction_history?_sort=${sort}&_order=${order}`)
        .then(res => {
            console.log(res.data)

            //invoke action history when we going to transaction admin page
            this.props.History(res.data)
        })
        .catch(err => console.log(err))

    }

    handleSort = (event) =>{
        let sort = event.target.value
        this.setState({sort: sort})
    }

    handleOrder = (event) =>{
        let order = event.target.value
        this.setState({order: order})
    }

    handleOpen = (id) =>{
        const {open, alert} = this.state
        // this.setState({open: !open, selId: id})
        this.setState({selId: id, alert: true})
    }

    handleClose = () => {
        this.setState({alert : false})
    }

    handleSelect = (event) =>{
        // this.setState({sort: this.sort.value})
        //         console.log(this.state.sort)
        console.log(event.target.value)
    }
    
    renderTableDialog = () =>{
        const { selId } = this.state
        return (
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Brand</TableCell>
                        <TableCell>Color</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selId !== null ? 
                this.props.history[selId].products.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>
                            <img src={item.images} width='100px' alt='product-image'/>
                        </TableCell>
                        <TableCell component="th" scope="row">{item.name}</TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>Rp. {item.price.toLocaleString()}</TableCell>
                    </TableRow>
                ))
                :
                null
            }
                </TableBody>
            </Table>
        )
    }

    renderTableHead = () =>{
        return (
            <TableRow>
                <TableCell>No</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Quantity</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Action</TableCell>
            </TableRow>
        )
    }
    
    renderTableBody = () =>{
        const {open, selId, alert } = this.state
        return this.props.history.map((item, index)=>{
            return (
                <TableRow>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{item.userID}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.totalQty}</TableCell>
                    <TableCell>Rp. {item.totalPrice.toLocaleString()}</TableCell>
                    <TableCell>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<ErrorIcon/>}
                            onClick={() => this.handleOpen(index)}
                        >
                            Details
                        </Button>
                    </TableCell>
                </TableRow>
            )
        })
        
    }
    render() {
        const {alert} = this.state
        return(
            <div style={styles.root}>
                <NavbarMaterial/>
                <div style={styles.container}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2%'}}>
                        <h1 style={styles.title}>Transaction History</h1>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <h3>Sort by</h3>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                label='Sort'
                                id="select"
                                inputRef={(sort) => this.sort = sort}
                                onChange={this.handleSort}
                                >
                                <MenuItem value="userID">Id</MenuItem>
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="totalPrice">Total</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-label">Order</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                label='Order'
                                id="demo-simple-select"
                                onChange={this.handleOrder}
                                >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                onClick={() => this.getHistoryData()}
                                >
                                SUBMIT
                            </Button>
                        </div>
                    </div>
                    <Table style={styles.table}>
                        <TableHead>
                            {this.renderTableHead()}
                        </TableHead>
                        <TableBody>
                            {this.renderTableBody()}
                        </TableBody>
                    </Table>
                    <Dialog
                        open={alert}
                        maxWidth='xl'
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"History Details"}</DialogTitle>
                        <DialogContent>
                            {/* <DialogContentText id="alert-dialog-description">
                                Are you sure to confrim this payment? <br></br>
                                Please input your password!
                            </DialogContentText> */}
                            {this.renderTableDialog()}
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            OK
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <Footer/>
            </div>
        )
    }
}

const styles={
    root: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    container:{
        minHeight: 'calc(100vh - 160px)',
        width: '70%',
        margin: '90px auto 30px auto',
    },
    title:{
        textAlign: 'center',
        margin:'1%'
    },
    table: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    }
}

const mapStateToProps = (state) =>{
    return {
       history: state.history 
    }
}

export default connect(mapStateToProps, { History })(TransactionHistoryAdmin)