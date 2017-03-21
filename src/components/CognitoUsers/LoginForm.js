import React, { PropTypes } from 'react'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { Spinner } from 'components/Spinner'

const FormLink = ({ disabled = false, onClick, children }) => {
  return disabled &&
    <a>{children}</a> ||
    <a href='#' onClick={onClick}>{children}</a>
}

FormLink.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node
}

const EmailField = ({ disabled = false, value = '', onChange }) => {
  return <Row>
    <Col>
      <FormGroup>
        <Label for='loginEmail'>Email</Label>
        <Input
          disabled={disabled}
          size='lg'
          type='email'
          name='email'
          id='loginEmail'
          placeholder='Email address'
          value={value}
          onChange={onChange}
          required />
      </FormGroup>
    </Col>
  </Row>
}

EmailField.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func
}

const PasswordField = ({ disabled = false, label = 'Password', value = '', onChange }) => {
  return <Row>
    <Col>
      <FormGroup>
        <Label for='loginPassword'>{label}</Label>
        <Input
          disabled={disabled}
          size='lg'
          type='password'
          name='email'
          id='loginPassword'
          placeholder={label}
          value={value}
          onChange={onChange}
          required />
      </FormGroup>
    </Col>
  </Row>
}

PasswordField.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
}

const StudentIDField = ({ disabled = false, value, onChange }) => {
  return <Row>
    <Col>
      <FormGroup>
        <Label for='loginStudentID'>Student ID</Label>
        <Input
          disabled={disabled}
          size='lg'
          type='text'
          name='studentid'
          id='loginStudentID'
          placeholder='Student ID'
          value={value}
          onChange={onChange}
          required />
      </FormGroup>
    </Col>
  </Row>
}

StudentIDField.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string
}

const ConfirmationCodeField = ({ disabled = false, value, onChange, onResendCode, codeSending = false }) => {
  return <Row>
    <Col>
      <span style={{ color: 'blue' }}>
        A confirmation code has been sent to your email address. Please enter it below:
      </span>
      <br /><br />
      <FormGroup>
        <Label for='loginConfirm'>Confirmation Code</Label>
        <Input
          disabled={disabled}
          size='lg'
          type='text'
          name='confirm'
          id='loginConfirm'
          placeholder='Confirmation code'
          value={value}
          onChange={onChange}
          required />
      </FormGroup>
      {onResendCode &&
        <span>
        Didn&#x27;t get the code?
        &nbsp;
        <FormLink
          disabled={disabled}
          onClick={onResendCode}>Resend code</FormLink>
          {codeSending && <Spinner size={1} />}
        </span>}
    </Col>
  </Row>
}

ConfirmationCodeField.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onResendCode: PropTypes.func,
  codeSending: PropTypes.bool
}

const MessageArea = ({ message, errorMessage }) => {
  return <Row>
    <Col>
      {message &&
        <span style={{ color: 'green' }}>
          {message}
        </span>}
      {errorMessage &&
        <span style={{ color: 'red' }}>
          <i className='fa fa-fw fa-exclamation-triangle'>&nbsp;</i>
          {errorMessage}
        </span>}
    </Col>
  </Row>
}

MessageArea.propTypes = {
  message: PropTypes.string,
  errorMessage: PropTypes.string
}

const SubmitButton = ({ requestInProgress = false, label }) => {
  return <Row>
    <Col>
      <Button
        disabled={requestInProgress}
        type='submit'
        color='primary'>
        <span><i className='fa fa-fw'>&nbsp;</i></span>
        &nbsp;
        <span>{label}</span>
        &nbsp;
        <Spinner
          size={1}
          visible={requestInProgress} />
      </Button>
    </Col>
  </Row>
}

SubmitButton.propTypes = {
  requestInProgress: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired
}

const ForgottenPasswordForm = ({
  requestInProgress = false,
  setModeLogin,
  message,
  errorMessage,
  forgotState,
  emailValue,
  passwordValue,
  confirmationCodeValue,
  onEmailChange,
  onPasswordChange,
  onConfirmationCodeChange
}) => (
  <Container style={{ 'border': '1px solid gray', 'maxWidth': '20em' }}>
    <Row>
      <Col><h1>Forgot Password</h1></Col>
    </Row>
    <Row>
      <Col>
        <FormLink
          disabled={requestInProgress}
          onClick={setModeLogin}>&lt; Back to the login form</FormLink>
      </Col>
    </Row>
    <Row><Col><hr /></Col></Row>
    <EmailField
      disabled={requestInProgress}
      value={emailValue}
      onChange={onEmailChange} />
    <PasswordField
      disabled={requestInProgress}
      value={passwordValue}
      label='New Password'
      onChange={onPasswordChange} />
    {(forgotState.status === 'pending') &&
      <ConfirmationCodeField
        disabled={requestInProgress}
        value={confirmationCodeValue}
        onChange={onConfirmationCodeChange}
        />}
    <Row><Col><hr /></Col></Row>
    <SubmitButton
      requestInProgress={requestInProgress}
      label='Request password change' />
    <Row><Col>&nbsp;</Col></Row>
    <MessageArea message={message} errorMessage={errorMessage} />
    <Row><Col>&nbsp;</Col></Row>
  </Container>
)

ForgottenPasswordForm.propTypes = {
  requestInProgress: PropTypes.bool.isRequired,
  setModeLogin: PropTypes.func.isRequired,
  message: PropTypes.string,
  errorMessage: PropTypes.string,
  forgotState: PropTypes.object.isRequired,
  emailValue: PropTypes.string,
  passwordValue: PropTypes.string,
  confirmationCodeValue: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onConfirmationCodeChange: PropTypes.func.isRequired
}

class LoginForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: 'hoggynz@gmail.com',
      password: 'eysky8yer',
      studentid: '',
      confirmationCode: ''
      // email: props.email,
      // password: ''
    }

    this.setModeLogin = ::this.setModeLogin
    this.setModeSignup = ::this.setModeSignup
    this.setModeForgotPassword = ::this.setModeForgotPassword
  }

  componentWillMount () {
    this.props.sessionCheck()
  }

  onSubmit = (event) => {
    event.preventDefault()
    if (this.props.mode === 'login') {
      this.props.login(this.state.email, this.state.password)
    } else if (this.props.mode === 'signup') {
      if (
        this.props.signUpState.status === 'pending' &&
        this.props.signUpState.email === this.state.email
      ) {
        this.props.confirm(this.state.email, this.state.confirmationCode)
      } else {
        this.props.signup(this.state.email, this.state.password)
      }
    }
  }

  onForgotSubmit = (event) => {
    event.preventDefault()
    if (
      this.props.forgotState.status === 'pending' &&
      this.state.confirmationCode !== ''
    ) {
      this.props.forgotConfirmRequest(this.state.email,
        this.state.password, this.state.confirmationCode)
    } else {
      this.props.forgotCodeRequest(this.state.email, this.state.password)
    }
  }

  changeEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  changeStudentID = (event) => {
    this.setState({ studentid: event.target.value })
  }

  changeConfirmationCode = (event) => {
    this.setState({ confirmationCode: event.target.value })
  }

  setModeLogin = (event) => {
    event.preventDefault()
    this.props.formModeSet('login')
  }

  setModeSignup = (event) => {
    event.preventDefault()
    this.props.formModeSet('signup')
  }

  setModeForgotPassword = (event) => {
    event.preventDefault()
    this.props.formModeSet('forgot')
  }

  onSignupCodeRequest = (event) => {
    event.preventDefault()
    this.props.signupCodeRequest(this.state.email)
  }

  onLogOut = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  render = () => {
    const signupConfirmMode = this.props.mode === 'signup' &&
      this.props.signUpState.status === 'pending' &&
      this.props.signUpState.email === this.state.email

    if (this.props.session && this.props.session.loggedInCheck) {
      // session check is quick, so don't show a spinner as it causes
      // a screen flicker on load
      return <span />
    }

    if (this.props.mode === 'forgot') {
      return <Form onSubmit={this.onForgotSubmit}>
        <ForgottenPasswordForm
          requestInProgress={this.props.requestInProgress}
          setModeLogin={this.setModeLogin}
          message={this.props.message}
          errorMessage={this.props.errorMessage}
          forgotState={this.props.forgotState}
          emailValue={this.state.email}
          passwordValue={this.state.password}
          confirmationCodeValue={this.state.confirmationCode}
          /* handlers */
          onEmailChange={this.changeEmail}
          onPasswordChange={this.changePassword}
          onConfirmationCodeChange={this.changeConfirmationCode} />
      </Form>
    }

    return <Form onSubmit={this.onSubmit}>
      {this.props.token === '' &&
        <Container style={{ 'border': '1px solid gray', 'maxWidth': '20em' }}>
          <Row>
            <Col>
              {this.props.mode === 'login' && <h1>Log in</h1>}
              {this.props.mode === 'signup' && <h1>Sign up {signupConfirmMode && ' confirm'}</h1>}
            </Col>
          </Row>
          <Row>
            {this.props.mode === 'login' &&
              <Col>Not registered yet?&nbsp;
                <FormLink disabled={this.props.requestInProgress} onClick={this.setModeSignup}>Sign up</FormLink>
              </Col>}
            {this.props.mode === 'signup' &&
              <Col>Already registered?&nbsp;
                <FormLink disabled={this.props.requestInProgress} onClick={this.setModeLogin}>Log in</FormLink>
              </Col>}
          </Row>
          <Row><Col><hr /></Col></Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for='loginEmail'>Email</Label>
                <Input
                  disabled={this.props.requestInProgress}
                  size='lg'
                  type='email'
                  name='email'
                  id='loginEmail'
                  placeholder='Email address'
                  value={this.state.email}
                  onChange={this.changeEmail}
                  required />
              </FormGroup>
            </Col>
          </Row>
          {signupConfirmMode &&
            <Row>
              <Col>
                <span style={{ color: 'blue' }}>
                  A confirmation code has been sent to your email address. Please enter it below:
                </span>
                <br /><br />
                <FormGroup>
                  <Label for='loginConfirm'>Confirmation Code</Label>
                  <Input
                    disabled={this.props.requestInProgress}
                    size='lg'
                    type='text'
                    name='confirm'
                    id='loginConfirm'
                    placeholder='Confirmation code'
                    value={this.state.confirmationCode}
                    onChange={this.changeConfirmationCode}
                    required />
                </FormGroup>
                Didn&#x27;t get the code?
                &nbsp;
                <FormLink
                  disabled={this.props.requestInProgress}
                  onClick={this.onSignupCodeRequest}>Resend code</FormLink>
                {this.props.signUpState.codeSending &&
                  <Spinner size={1} />}
              </Col>
            </Row>
            }
          {!signupConfirmMode &&
            <PasswordField
              disabled={this.props.requestInProgress}
              value={this.state.password}
              onChange={this.changePassword} />}
          {!signupConfirmMode && this.props.mode === 'signup' &&
            <StudentIDField
              disabled={this.props.requestInProgress}
              value={this.state.studentid}
              onChange={this.changeStudentID} />}
          <Row><Col>
            {this.props.mode === 'login' &&
              <FormLink
                disabled={this.props.requestInProgress}
                onClick={this.setModeForgotPassword}>Forgot your password?</FormLink>}
          </Col></Row>
          <Row><Col><hr /></Col></Row>
          <Row>
            <Col>
              <Button
                disabled={this.props.requestInProgress}
                type='submit'
                color='primary'>
                <span><i className='fa fa-fw'>&nbsp;</i></span>
                &nbsp;
                {this.props.mode === 'login' && <span>Log in</span>}
                {this.props.mode === 'signup' && !signupConfirmMode && <span>Sign up</span>}
                {this.props.mode === 'signup' && signupConfirmMode && <span>Send confirmation code</span>}
                &nbsp;
                <Spinner
                  size={1}
                  visible={this.props.requestInProgress} />
              </Button>
            </Col>
          </Row>
          <Row><Col>&nbsp;</Col></Row>
          <Row>
            <Col>
              {this.props.message &&
                <span style={{ color: 'green' }}>
                  {this.props.message}
                </span>}
              {this.props.errorMessage &&
                <span style={{ color: 'red' }}>
                  <i className='fa fa-fw fa-exclamation-triangle'>&nbsp;</i>
                  {this.props.errorMessage}
                </span>}
            </Col>
          </Row>
          <Row><Col>&nbsp;</Col></Row>
        </Container>}
    </Form>
  }
}

LoginForm.propTypes = {
  // functions
  formModeSet: PropTypes.func.isRequired,
  sessionCheck: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  signupCodeRequest: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  forgotCodeRequest: PropTypes.func.isRequired,
  forgotConfirmRequest: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,

  // state
  mode: PropTypes.string.isRequired,
  session: PropTypes.object.isRequired,
  requestInProgress: PropTypes.bool.isRequired,
  message: PropTypes.string,
  errorMessage: PropTypes.string,
  signUpState: PropTypes.object,
  forgotState: PropTypes.object,
  token: PropTypes.string,
  email: PropTypes.string
}

export default LoginForm
