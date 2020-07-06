import React from 'react'
import Axios from 'axios'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    IconButton,
    TextField,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import '../../index.css'
import NavbarMaterial from '../../components/navbar'
import Footer from '../../components/footer';

const URL = 'http://localhost:2000/'

class AccountManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            id: false,
            first: false,
            last: false,
            email: false,
            selId: null,
            errorEdit: [false, false, false, false]
        }
    }

    componentDidMount() {
        this.getData('users')
    }

    getData = (address) => {
        Axios.get(URL + address)
            .then(response => {
                this.setState({ data: response.data })
                console.log(response.data)
            })
            .catch(error => console.log(error))
    }

    handleDelete = (id) => {
        Axios.delete(URL + `users/${id}`)
            .then(response => {
                this.getData('users')
                console.log(response.data)
            })
            .catch(error => { console.log(error) })
    }

    editRow = (id) => {
        this.setState({ selId: id })
    }

    inputValidation = (fisrtName, lastName, email) => {
        // email
        let firstNameError = fisrtName ? false : true
        let lastNameError = lastName ? false : true
        let emailError = email ? false : true

        if (firstNameError || lastNameError || emailError) {
            return [firstNameError, lastNameError, emailError]
        }

        // check include @ and '.'
        if (!email.includes('@') || !email.includes('.')) {
            console.log('check @')
            return [firstNameError, lastNameError, true]
        }

        // check @ and "." is single
        if (email.split('@') > 2 || email.split('.') > 2) {
            console.log('check single @')
            return [firstNameError, lastNameError, true]
        }

        // check if indexOf @ is smaller than "."
        let at = email.indexOf('@')
        let dot = email.indexOf('.')
        if (at > dot || at - dot === 1) {
            console.log('check at and dot')
            return [firstNameError, lastNameError, true]
        }

        return [false, false, false]
    }

    doneEdit = (id) => {
        let role = this.roleEdit.value,
            username = this.usernameEdit.value,
            email = this.emailEdit.value,
            password = this.passwordEdit.value,
            checkEmail = this.emailEdit.value.includes('@') && this.emailEdit.value.charAt(this.emailEdit.value.length - 1) !== '@'

        if (role !== '' && username !== '' && email !== '' && password !== '' && checkEmail) {
            Axios.patch(URL + `users/${id}`, { role, username, email, password })
                .then(response => {
                    console.log(response.data)
                    this.getData('users')
                    this.setState({ selId: null })
                })
                .catch(error => console.log(error))
        }
    }

    cancelEdit = () => {
        this.setState({ selId: null })
    }

    tableHead = () => {
        return (
            <TableRow>
                <TableCell>
                    No.
                </TableCell>
                <TableCell align="center">
                    <TableSortLabel
                        active={true}
                        direction={this.state.first ? 'desc' : 'asc'}
                        onClick={() => this.handleSort('first')}
                    />
                    Role
                </TableCell>
                <TableCell align="center">
                    <TableSortLabel
                        active={true}
                        direction={this.state.last ? 'desc' : 'asc'}
                        onClick={() => this.handleSort('last')}
                    />
                    Username
                </TableCell>
                <TableCell align="center">
                    <TableSortLabel
                        active={true}
                        direction={this.state.email ? 'desc' : 'asc'}
                        onClick={() => this.handleSort('email')}
                    />
                    Email
                </TableCell>
                <TableCell align="center">
                    <TableSortLabel
                        active={true}
                        direction={this.state.email ? 'desc' : 'asc'}
                        onClick={() => this.handleSort('email')}
                    />
                    Password
                </TableCell>
                <TableCell align="center">
                    Action
                </TableCell>
            </TableRow>
        )
    }

    tableBody = () => {
        const { data, errorEdit, selId } = this.state
        return data.map((item, index) => {
            if (selId === item.id) {
                console.log(this.state.selId)
                return (
                    <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            <TextField
                                error={errorEdit[0]}
                                label={data[index].role}
                                inputRef={(roleEdit) => this.roleEdit = roleEdit}
                                helperText={errorEdit[0] ? '*required' : ''}
                                defaultValue={this.state.data[index].role}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                label={data[index].username}
                                error={errorEdit[1]}
                                inputRef={(usernameEdit) => this.usernameEdit = usernameEdit}
                                helperText={errorEdit[1] ? '*required' : ''}
                                defaultValue={data[index].username}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                label={data[index].email}
                                error={errorEdit[2]}
                                inputRef={(emailEdit) => this.emailEdit = emailEdit}
                                helperText={errorEdit[2] ? '*not valid. Ex: mail@domain.com' : ''}
                                defaultValue={data[index].email}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                label={data[index].password}
                                error={errorEdit[3]}
                                inputRef={(passwordEdit) => this.passwordEdit = passwordEdit}
                                helperText={errorEdit[3] ? '*required' : ''}
                                defaultValue={data[index].password}
                            />
                        </TableCell>
                        <TableCell>
                            <IconButton aria-label="check" onClick={() => this.doneEdit(item.id)}>
                                <CheckIcon />
                            </IconButton>
                            <IconButton aria-label="clear" onClick={() => this.cancelEdit(item.id)}>
                                <ClearIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                )
            } else {
                console.log(this.state.selId)
                return (
                    <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                            {index + 1}
                        </TableCell>
                        <TableCell align="center">{item.role}</TableCell>
                        <TableCell align="center">{item.username}</TableCell>
                        <TableCell align="center">{item.email}</TableCell>
                        <TableCell align="center">{item.password}</TableCell>
                        <TableCell align="center">
                            <IconButton aria-label="delete" onClick={() => this.handleDelete(item.id)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => this.editRow(item.id)}>
                                <CreateIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                )
            }
        }
        )
    }

    render() {
        console.log(this.state.data)
        return (
            <div style={styles.root}>
                <NavbarMaterial />
                <div>
                    <h2>Manage User</h2>
                    <div id="menu">
                        <Table aria-label="simple table">
                            <TableHead style={{ backgroundColor: '#f2f2f2' }}>
                                {this.tableHead()}
                            </TableHead>
                            <TableBody>
                                {this.tableBody()}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

const styles = {
    root: {
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#f2f2f2',
        paddingTop: '110px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
}

export default AccountManagement