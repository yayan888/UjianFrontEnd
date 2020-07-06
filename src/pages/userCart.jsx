import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {
    Table,
    TableHead,
    TableBody,
    TableFooter,
    TableCell,
    TableRow,
    TableSortLabel,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip 
} from '@material-ui/core'

import { LogIn } from '../actions'
import NavbarMaterial from '../components/navbar'
import Footer from '../components/footer'

import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

class UserCart extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            products: [],
            selActive: null,
            sortName: false,
            sortBrand: false,
            sortColor: false,
            sortSize: false,
            sortQty: false,
            sortPrice: false,
            alert : false,
            showPassword:false,
            passError: false,
            paymentError: false,
            paymentTextError: '',
            selId : null,
            qty: 1,
            disable: false
        }
    } 

    componentDidMount() {
        Axios.get('http://localhost:2000/products')
        .then((res) => {
            console.log("product", res.data)
            this.setState({ products: res.data })
        }).catch((err) => {
            console.log("Error!", err)
        })
    }

    handleSort = (type) =>{
        const { sortName, sortBrand, sortColor, sortSize, sortQty, sortPrice, selActive } = this.state
        let tempCart = this.props.cart
        console.log("before sort: ",tempCart)
        console.log('length : ', tempCart.length)
        if(type==='name'){
            this.setState({sortName : !sortName, selActive: 'name'})
            sortName ? 
            tempCart.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
            :
            tempCart.sort((a,b) => (a.name > b.name) ? -1 : ((b.name > a.name) ? 1 : 0))
            
        } else if(type==='brand'){
            this.setState({sortBrand : !sortBrand, selActive: 'brand'})
            sortBrand ? 
            tempCart.sort((a,b) => (a.brand > b.brand) ? 1 : ((b.brand > a.brand) ? -1 : 0))
            :
            tempCart.sort((a,b) => (a.brand > b.brand) ? -1 : ((b.brand > a.brand) ? 1 : 0))
        } else if(type === 'color'){
            this.setState({sortColor : !sortColor, selActive: 'color'})
            sortColor ? 
            tempCart.sort((a,b) => (a.color > b.color) ? 1 : ((b.color > a.color) ? -1 : 0))
            :
            tempCart.sort((a,b) => (a.color > b.color) ? -1 : ((b.color > a.color) ? 1 : 0))
        } else if(type ==='size'){
            this.setState({sortSize : !sortSize, selActive: 'size'})
            sortSize ? 
            tempCart.sort((a,b) => (a.size > b.size) ? 1 : ((b.size > a.size) ? -1 : 0))
            :
            tempCart.sort((a,b) => (a.size > b.size) ? -1 : ((b.size > a.size) ? 1 : 0))
        } else if(type === 'quantity'){
            this.setState({sortQty : !sortQty, selActive: 'quantity'})
            sortQty ? 
            tempCart.sort((a,b) => (a.qty > b.qty) ? 1 : ((b.qty > a.qty) ? -1 : 0))
            :
            tempCart.sort((a,b) => (a.qty > b.qty) ? -1 : ((b.qty > a.qty) ? 1 : 0))
        } else if(type === 'price'){
            this.setState({sortPrice : !sortPrice, selActive: 'price'})
            sortPrice ? 
            tempCart.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
            :
            tempCart.sort((a,b) => (a.price > b.price) ? -1 : ((b.price > a.price) ? 1 : 0))
        }

        // update data in database
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : tempCart })
        .then(res => {
            console.log(res.data)

            // update data redux
            Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then(res => {
                console.log(res.data)
                this.props.LogIn(res.data)
                this.setState({selActive: null})
            })
        })
        .catch(err => console.log(err))
        console.log("after sort: ", tempCart)
    }

    getUpdateProduct = (input) =>{
        // update data in database
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : input })
        .then(res => {
            console.log(res.data)

            // update data redux
            Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then(res => {
                console.log(res.data)
                this.props.LogIn(res.data)
            })
        })
        .catch(err => console.log(err))
    }

    handleMinus = (index) =>{
        let tempCart = this.props.cart
        let count = this.props.cart[index].qty
        count -= 1

        let idProduct = this.props.cart[index].id
        let stock = 0
        let size = tempCart[index].size
        this.state.products[idProduct-1].stock.map(item =>{
            if(item.code === size){
                stock = item.total
            }
        })

        if(count === 0){
            tempCart.splice(index, 1)
            this.setState({selId: null})
        } else {
            if(count < stock){
                let price = this.state.products[idProduct-1].price
                tempCart[index].qty = parseInt(count)
                tempCart[index].price = count*price
                this.setState({disable: false})
            }
        }

        this.getUpdateProduct(tempCart)
    }

    handlePlus = (index) =>{
        let tempCart = this.props.cart
        let idProduct = this.props.cart[index].id
        let count = this.props.cart[index].qty
        let stock = 0
        let size = tempCart[index].size
        this.state.products[idProduct-1].stock.map(item =>{
            if(item.code === size){
                stock = item.total
            }
        })
        
        if(count === stock){
            this.setState({disable: true})
        } else {
            count += 1
            let price = this.state.products[idProduct-1].price
            tempCart[index].qty = parseInt(count)
            tempCart[index].price = count*price
            
            this.setState({disable: false})
            this.getUpdateProduct(tempCart)
        }
        
    }

    handleEdit = (index) => {        
        this.setState({selId: index})
    }

    doneEdit = (index) => {
        this.setState({selId: null})
    }

    cancelEdit = () => {
        this.setState({selId: null})
    }

    handleDelete = (index) => {
        console.log(index)

        let tempCart = this.props.cart
        tempCart.splice(index, 1)

        // update data in database
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : tempCart })
        .then(res => {
            console.log(res.data)

            // update data redux
            Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then(res => {
                console.log(res.data)
                this.props.LogIn(res.data)
            })
        })
        .catch(err => console.log(err))
    }

    handleCheckOut = () => {
        console.log('check out')

        if (this.props.cart.length === 0) return
        
        this.setState({alert : true})
    }

    handleClose = () => {
        this.setState({alert : false})
    }

    handleOk = () => {
        const {passError, alert, paymentError, paymentTextError} = this.state

        let history = {
            userID : this.props.id,
            username : this.props.username,
            date : new Date().toLocaleString(),
            totalQty : this.props.cart.map(item => item.qty).reduce((a, b) => a + b),
            totalPrice : this.props.cart.map(item => item.price).reduce((a, b) => a + b),
            products : this.props.cart,
        }
        let checkPass = this.password.value
        let checkPayment = this.payment.value
        let payment = history.totalPrice
        
        
        // let idProduct = 
        console.log(history)
        
        // check password
        Axios.get(`http://localhost:2000/users/${this.props.id}`)
        .then(res => {
            console.log(res.data)
            let password = res.data.password
            
            if(password === checkPass && checkPayment >= payment){
                // update database
                Axios.post('http://localhost:2000/transaction_history', history)
                .then(res => {
                    console.log(res.data)
                    
                    // let tempProducts = products
                    // let tempCart = this.props.cart
                    // // update stock
                    // tempProducts.forEach((item, index) => {
                    //     tempCart.forEach((value, idx) => {
                    //         if (item.name == value.name) {
                    //             console.log(item.name, value.name)
                                
                    //             let tempStocks = products[index].stock
                    //             let tempCart = this.props.cart[idx]
                    //             tempStocks.forEach((item, index) => {
                    //                 if (item.code == tempCart.size) {
                    //                     console.log(item.code, tempCart.size)
                    //                     console.log(item.total, tempCart.qty)
                    //                     item.total -= tempCart.qty
                    //                     console.log(item.total)
                    //                 }
                    //             });
                    //             console.log(tempStocks)
                    //             console.log(products[index].id)
                    //             Axios.patch(`http://localhost:2000/products/${products[index].id}`, { stock: tempStocks })
                    //                 .then((res) => {
                    //                     console.log("sukses")
                    //                 })
                    //                 .catch((err) => {
                    //                     console.log(err)
                    //                 })
                    //         }
                    //     })
                    // })
                    
                    // update cart user => []
                    Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : [] })
                    .then(res => {
                    console.log(res.data)
                        

                    // update data redux
                    Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then(res => {
                        console.log(res.data)
                        this.props.LogIn(res.data)
                        })
                    })
                })
                this.setState({alert: !alert})
            } else {
                this.setState({passError: !passError, paymentError: ! paymentError})
            }
            
        })
        .catch(err => console.log(err))
    }

    renderTableHead = () => {
        const { sortName, sortBrand, sortColor, sortSize, sortQty, sortPrice, selActive} = this.state
        return (
            <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="left">
                    <TableSortLabel
                        active={true}
                        // active={selActive === 'name'? true : false}
                        direction={sortName ?'desc':'asc'}
                        onClick={() => this.handleSort('name')}
                        />
                    Name
                </TableCell>
                <TableCell align="left">
                    <TableSortLabel
                        active={true}
                        // active={selActive === 'brand'? true : false}
                        direction={sortBrand ?'desc':'asc'}
                        onClick={() => this.handleSort('brand')}
                        />
                    Brand
                </TableCell>
                <TableCell align="left">
                    <TableSortLabel
                        active={true}
                        // active={selActive === 'color'? true : false}
                        direction={sortColor ?'desc':'asc'}
                        onClick={() => this.handleSort('color')}
                        />
                    Color
                </TableCell>
                <TableCell align="left">
                    <TableSortLabel
                        active={true}
                        // active={selActive === 'size'? true : false}
                        direction={sortSize ?'desc':'asc'}
                        onClick={() => this.handleSort('size')}
                        />
                    Size
                </TableCell>
                <TableCell align="left">
                    <TableSortLabel
                        active={true}
                        // active={selActive === 'quantity'? true : false}
                        direction={sortQty ?'desc':'asc'}
                        onClick={() => this.handleSort('quantity')}
                        />
                    Qty
                </TableCell>
                <TableCell align="left">
                    <TableSortLabel
                        active={true}
                        // active={selActive === 'price'? true : false}
                        direction={sortPrice ?'desc':'asc'}
                        onClick={() => this.handleSort('price')}
                        />
                    Total
                </TableCell>
                <TableCell align="center">Action</TableCell>
            </TableRow>
        )
    }

    renderTableBody = () => {
        const { selId, disable} = this.state
        return this.props.cart.map((item, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <img src={item.images} width='100px'/>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell align="center">{item.size}</TableCell>
                    <TableCell align="center">
                        { selId === index ?
                        <>
                            <IconButton
                                color="#f2f2f2" 
                                variant="contained"
                                onClick={() => this.handleMinus(index)}>
                                <RemoveCircleIcon/>
                            </IconButton>
                        <Typography>{item.qty}</Typography>
                            <IconButton
                                disabled={disable ? true : false}
                                color="#f2f2f2" 
                                variant="contained"
                                onClick={() => this.handlePlus(index)}>
                                <AddCircleIcon/>
                            </IconButton>
                        </>
                        :
                        item.qty
                        }
                    </TableCell>
                    <TableCell>Rp. {item.price.toLocaleString()}</TableCell>
                    <TableCell>
                        {
                        this.state.selId == index ?
                        <>
                        <Tooltip title="Done">
                            <IconButton 
                            color="primary" 
                            variant="contained"
                            onClick={() => this.doneEdit(index)}
                            >
                                <DoneIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                            <IconButton 
                                color="primary" 
                                variant="contained"
                                onClick={() => this.cancelEdit()}
                                >
                                <ClearIcon/>
                            </IconButton>
                        </Tooltip>
                        </>
                        :
                        
                        <>
                        <Tooltip title="Edit">
                            <IconButton 
                                color="primary" 
                                variant="contained"
                                onClick={() => this.handleEdit(index)}
                                >
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton 
                                color="primary" 
                                variant="contained"
                                onClick={() => this.handleDelete(index)}
                                >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                        </>
                        }
                    </TableCell>
                </TableRow>
            )
        })
    }
    renderTableFooter = () => {
        let count = 0
        this.props.cart.map((item) => {
            count += item.price
        })
        return (
            <TableRow>
                <TableCell colSpan={5}></TableCell>
                <TableCell colSpan={2}><Typography style={{ color: 'white' }}>Total Payment</Typography></TableCell>
                <TableCell><Typography style={{ color: 'white' }}> Rp. {count.toLocaleString()}</Typography></TableCell>
                <TableCell>
                    <Button 
                        variant="contained" 
                        style={styles.buttonCheckOut}
                        onClick={this.handleCheckOut}
                    >
                        Check Out
                    </Button>
                </TableCell>
            </TableRow>
        )
    }
    render () {
        const { alert, showPassword, passError, paymentError, paymentTextError } = this.state
        return (
            <div style={styles.root}>
                <NavbarMaterial/>
                <div style={styles.container}>
                    <h1 style={styles.title}>{this.props.username}'s Cart</h1>
                    <Table style={styles.table}>
                        <colgroup>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col style={{width: '15%'}}/>
                            <col style={{width: '7%'}}/>
                            <col style={{width: '7%'}}/>
                            <col/>
                            <col/>
                        </colgroup>
                        <TableHead>{this.renderTableHead()}</TableHead>
                        <TableBody>{this.renderTableBody()}</TableBody>
                        <TableFooter style={styles.tfoot}>{this.renderTableFooter()}</TableFooter>
                    </Table>
                    <Dialog
                        open={alert}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"💳 Confirmation"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure to confrim this payment? <br></br>
                                Please input your password!
                            </DialogContentText>
                            <div style={{display:'flex', flexDirection: 'column', marginBottom: '1%'}}>
                                <TextField
                                    autoFocus
                                    error = {paymentError}
                                    variant='outlined' 
                                    placeholder='Money'
                                    helperText={paymentTextError}
                                    inputRef={(payment) => this.payment = payment}
                                    type='text'
                                    InputProps={{
                                        startAdornment:
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon/>
                                        </InputAdornment>
                                    }}
                                    style={{ marginBottom: '2%'}}
                                />
                                <TextField
                                    autoFocus
                                    error = {passError}
                                    variant='outlined' 
                                    placeholder='Password'
                                    helperText={passError? 'Invalid password' : ''}
                                    inputRef={(password) => this.password = password}
                                    type={showPassword? 'text' : 'password'}
                                    InputProps={{
                                        startAdornment:
                                        <InputAdornment position="start">
                                            <LockIcon/>
                                        </InputAdornment>,
                                        endAdornment:
                                        <IconButton position="end" onClick={() => this.setState({showPassword: !showPassword})}>
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    }}
                                />
                            </div>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleOk} color="primary" autoFocus>
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
const styles = {
    root : {
        minHeight : '100vh',
        backgroundColor : '#f2f2f2',
        paddingTop : '90px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // alignItems: 'space-between'
    },
    container:{
        padding: '0 10%'
    },
    title : {
        margin : '2% 0px',
        textTransform: 'capitalize'
    },
    table:{
        backgroundColor: 'white',
        width: '100%'
    },
    tfoot:{
        backgroundColor: '#404146', 
        color: 'white' 
    },
    buttonCheckOut : {
        marginTop : '3%',
        color : 'white',
        backgroundColor : '#130f40'
    }
}
const mapStateToProps = (state) => {
    return {
        cart : state.user.cart,
        id : state.user.id,
        username : state.user.username
    }
}
export default connect(mapStateToProps, { LogIn })(UserCart)