import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import CheckoutPage from './pages/checkout/checkout.component';

import Header from './components/header/header.component';

import { auth, createUserProfileDocument/*, addCollectionAndDocuments*/ } from './firebase/firebase.utils';

import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';
//import { selectCollectionsForPreview } from './redux/shop/shop.selectors';

class App extends React.Component{
	/*constructor(){
		super();

		this.state = {
			currentUser: null
		}
	}*/ // needed fefore Redux

	unsubscribeFromAuth = null;

	componentDidMount(){
		const {setCurrentUser/*, collectionsArray*/} = this.props;

		this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
			if(userAuth){
				const userRef = await createUserProfileDocument(userAuth);

				userRef.onSnapshot(snapShot => {
					setCurrentUser({
						id: snapShot.id,
						...snapShot.data()
					})
					/*this.setState( // before Redux
						{
							currentUser: {
								id: snapShot.id,
								...snapShot.data()
							}
					});*/
				});

			}
			
			//this.setState({currentUser: userAuth});
			setCurrentUser(userAuth);
			/*addCollectionAndDocuments(
				'collections',
				collectionsArray.map(({title, items}) => ({title, items})))*/
		})
	}

	componentWillUnmount(){
		this.unsubscribeFromAuth();
	}

	render(){
		return (
			<div>

				<Header />
				<Switch>
					<Route exact path='/' component={HomePage}></Route>
					<Route path='/shop' component={ShopPage}></Route>
					<Route exact path='/checkout' component={CheckoutPage}></Route>
					<Route exact path='/signin' render={() => 
						this.props.currentUser ? (
							<Redirect to='/' />
						) : (
							<SignInAndSignUpPage />
						)}/*component={SignInAndSignUpPage}*/></Route>
				</Switch>
			</div>
		);
	}
}

//const mapStateToProps = ({ user }) => ({
	//currentUser: user.currentUser
const mapStateToProps = createStructuredSelector({
	currentUser: selectCurrentUser,
	//collectionsArray: selectCollectionsForPreview
});

const mapDispatchToProps = dispatch => ({
	setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

//<Header currentUser={this.state.currentUser} /> //line 61 before Redux