import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { reject } from 'q'
import { Router } from '@angular/router'
import { Subject } from 'rxjs/Subject'
import { AlertWindowService } from '../alert-window.service'
import { AuthUser } from '../classes/auth-user';
declare var AWS: any
declare var AWSCognito: any
declare var FB: any

declare var window: any

@Injectable()
export class AuthService {

  private selectedPageSource = new Subject<string>()
  $selectedPage = this.selectedPageSource.asObservable()

  private prevSelectedPageSource = new Subject<string>()
  $prevSelectedPage = this.prevSelectedPageSource.asObservable()

  private localUserSource = new Subject<AuthUser>()
  $localUser = this.localUserSource.asObservable()

  userpoolId: string = 'us-east-1_na5sZOvyN'
  clientId: string = '6sqkbatu0tgo4lciv2l5is8mtk'
  identityPoolId: string = 'us-east-1:5a5c2a67-22e7-436c-8bce-a77322a4d11f'

  poolData = {
    UserPoolId: this.userpoolId,
    ClientId: this.clientId
  }

  constructor(private alertwindowservice: AlertWindowService, private http: HttpClient, private router: Router) { }

  createUser(uid, name, email) {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/users/createuser'
    // // // // console.log('the uid is: ' + uid)
    let params = {
      uid: uid,
      displayName: name,
      email: email
    }

    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    })

    return promise
  }

  getUser(uid) {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/users/getuser'
    let params = {
      uid: uid
    }

    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    })
    return promise
  }

  updateUser(uid, authToken, params) {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/users/updateuser'
    params['uid'] = uid
    params['authToken'] = authToken
    // // console.log(params)
    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    })
    return promise
  }

  getUserAsAuth(uid, authToken) {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/users/getuserasauth'
    let params = {
      uid: uid,
      authToken: authToken
    }

    // // // console.log(params)

    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          // // // console.log(res)
          resolve(res)
        },
        err => {
          // // // console.log(err)
          reject(err)
        }
      )
    })
    return promise
  }

  getCreds(creds: any, accessToken: string, email: string, displayName: string, count: number) {
    let counter = count
    let recurse = (val, count) => {
      setTimeout(() => {
        if (counter < 5) {
          counter++
          // // // // console.log(count)
          this.getCreds(val, accessToken, email, displayName, counter)
        } else {
          alert('There was an error logging you in. Please try again later.')
        }
      }, 200)
    }

    let getUser = (uid, authToken) => {
      return this.getUserAsAuth(uid, authToken)
    }

    let setUser = (user, uid, accessToken) => {
      this.setUser(user, uid, accessToken, email)
    }

    let createUser = (uid: string, name: string) => {
      return this.createUser(uid, name, email)
    }

    creds.get((err) => {
      if (err) {
        creds.clearCachedId((err, data) => {
          if (err) this.alertwindowservice.showDataWithButton('An error has occurred: ' + err)
        })
      }

      if (!creds.data) {
        recurse(creds, counter)
      } else {

        var uid = creds.data.IdentityId
        var alertwindowservice = this.alertwindowservice
        getUser(uid, accessToken).then(
          res => {
            try {
              var result = Object.keys(res['body'])
              if (result.length > 0) {
                setUser(res, uid, accessToken)
              } else {
                createUser(uid, displayName).then(
                  res => {
                    recurse(creds, counter)
                  },
                  err => {
                    this.alertwindowservice.showDataWithButton('An error has occurred: ' + err)
                  }
                )
              }
            } catch (e) {
              alertwindowservice.showDataWithButton('There was an error logging you in.')
            }

          },
          err => {
            this.alertwindowservice.showDataWithButton('An error has occurred: ' + err)
          }
        )
      }
    }
    )
  }

  getAuthenticatedUserAttributes(cognitoUser, accessToken) {
    return new Promise((resolve, reject) => {
      cognitoUser.getUserAttributes((err, data) => {
        if (err) {
          this.alertwindowservice.showDataWithButton('An error has occurred: ' + err)
        } else {
          resolve(data)
        }
      })
    })
  }

  login(userName, password) {
    this.alertwindowservice.showDataWithoutButton('Logging in...')
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/signin'
    // // // // console.log('the uid is: ' + uid)
    let params = {
      username: userName,
      password: password
    }

    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    })

    promise.then(
      res => {
        switch (res['statusCode']) {
          case 200:
            this.setAuthUser(res['data'])
            break
          case 401:
            this.alertwindowservice.showDataWithButton('Your username or password is incorrect.')
            break
          default:

        }

      },
      err => {

      }
    )
    // var authenticationData = {
    //     Username : userName,
    //     Password : password,
    // }
    // var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData)

    // var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData)

    // var userData = {
    //     Username : userName,
    //     Pool : userPool
    // }
    // var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData)

    // let getCreds = (creds, accessToken, email, name)=>{
    //   let count = 0
    //   this.getCreds(creds, accessToken, email, name, count)
    // }

    // let getAuthenticatedUserAttributes = (cognitoUser, accessToken) => {
    //   return this.getAuthenticatedUserAttributes(cognitoUser, accessToken)
    // }

    // let identityPoolId = this.identityPoolId
    // let alertwindowservice = this.alertwindowservice
    // cognitoUser.authenticateUser(authenticationDetails, {
    //     onSuccess: function (result) {
    //       alertwindowservice.showDataWithoutButton('Loading Profile')
    //       var accessToken = result.getAccessToken().getJwtToken()
    //       /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
    //       var idToken = result.getIdToken().getJwtToken()

    //       var cogkey = 'cognito-idp.us-east-1.amazonaws.com/' + this.userpoolId
    //       AWS.config.region = 'us-east-1'

    //       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //         IdentityPoolId: identityPoolId,
    //         Logins: {
    //           'cognito-idp.us-east-1.amazonaws.com/us-east-1_na5sZOvyN' : result.idToken.jwtToken
    //         }
    //       })
    //       getAuthenticatedUserAttributes(cognitoUser, accessToken).then(
    //         res => {
    //           var email:string = Object.values(res).find((x) =>{
    //             return x.Name == 'email'
    //           }).Value
    //           var name:string = Object.values(res).find((x) =>{
    //             return x.Name == 'name'
    //           }).Value
    //           getCreds(AWS.config.credentials, accessToken, email, name)
    //         },
    //         err => {
    //           this.alertwindowservice.showWithButton(err)
    //         }
    //       )
    //     },
    //     onFailure: function(err) {
    //       alertwindowservice.showDataWithButton('Incorrect Username or Password')
    //       // // // // console.log(this.alertwindowservice)
    //     },
    // })
  }

  createLoginSession(uid, user) {
    localStorage.setItem('authSession', JSON.stringify({
      uid: uid,
      isLoggedIn: true,
      user: user
    }))
    this.setLocalUser(user)
    // navigate user to profile page
  }

  getNameFromUserSession() {
    try {
      return JSON.parse(localStorage.getItem('authSession')).user.displayName
    } catch (e) {
      return null
    }
  }

  createUserFromFacebook(unique, name, picture, email) {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/users/createfacebookuser'
    let params = {
      uid: unique,
      displayName: name,
      profileThumbnailURL: picture,
      email: email
    }

    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    })

    return promise
  }

  alertError() {
    this.alertwindowservice.showDataWithButton('An error occurred while trying to log you in. Please try again later.')
  }

  performFacebookLogin(accessToken: string, picture, name, email) {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/loginwithfacebook'

    let params = {
      accessToken: accessToken,
      profileThumbnailURL: picture,
      displayName: name,
      email: email
    }

    // console.log(params)

    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    })

    return promise
  }

  facebookLogin(FB) {
    let name, picture, displayName, count, cognitoUser, email, accessToken
    let alertwindowservice = this.alertwindowservice
    let identityPoolId = this.identityPoolId

    let getUser = (uid, authToken) => {
      return this.getUserAsAuth(uid, authToken)
    }

    let alertError = () => {
      this.alertError()
    }

    let createFacebookUser = (unique, name, picture, email) => {
      return this.createUserFromFacebook(unique, name, picture, email)
    }

    let setUser = (user, uid, accessToken, email) => {
      this.setUser(user, uid, accessToken, email)
    }

    let setAuthUser = (user) => {
      this.setAuthUser(user)
    }

    let performFacebookLogin = (accessToken, picture, name, email) => {
      return this.performFacebookLogin(accessToken, picture, name, email)
    }



    // alertwindowservice.showDataWithoutButton('Logging In with Facebook')
    FB.login(function (response) {
      FB.AppEvents.logPageView()
      alertwindowservice.showDataWithoutButton('Logging In with Facebook')
      if (response.authResponse) {
        // AWS.config.region = 'us-east-1'
        accessToken = response.authResponse.accessToken
        // // console.log(accessToken)
        // let params = {
        //   IdentityPoolId: identityPoolId,
        //   Logins: {
        //     'graph.facebook.com': accessToken
        //   }
        // }
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials(params)

        let fbPromise = new Promise((resolve, reject) => {
          FB.api('/me', { fields: 'id, name, email' }, function (response) {
            if (response) {
              resolve(response)
            } else {
              reject()
            }
          })
        })



        fbPromise.then(
          res => {
            picture = 'https://graph.facebook.com/' + res['id'] + '/picture?width=500'
            name = res['name']
            email = res['email']

            performFacebookLogin(accessToken, picture, name, email).then(
              res => {
                let user = JSON.parse(res['body']['Payload']).body.Item
                if (user) {
                  setAuthUser(user)
                } else {
                  alertwindowservice.showDataWithButton('There was an error logging you in. Please try again later.')
                }

              },
              err => {
                // console.log(JSON.stringify(res))
              }
            )

            // // console.log('picture', picture)
            // // console.log('name', name)
            // // console.log('email', email)

            // AWS.config.credentials.get((err, data) => {
            //   if (err) {
            //     alertError()
            //   }
            //   // // // console.log(data)
            //   // // // console.log(AWS.config.credentials)
            //   try {
            //     var uid = AWS.config.credentials.data.IdentityId
            //     // console.log(uid)
            //     getUser(uid, accessToken).then(
            //       res => {
            //         let userRes = res
            //         // console.log(res)
            //         let user = res['body']['Item']
            //         // console.log(user)

            //         if (Object.keys(user).length < 1) {
            //           createFacebookUser(uid, name, picture, email).then(
            //             res => {
            //               getUser(uid, accessToken).then(
            //                 res => {
            //                   setUser(res, uid, accessToken, email)
            //                 }
            //               )
            //             }
            //           )
            //         } else {
            //           setUser(userRes, uid, accessToken, email)
            //         }

            //       },
            //       err => {
            //         alertError()
            //       }
            //     )
            //   } catch (e) {

            //   }
            //   // getUser()
            //   // // // // console.log(data)
            //   // // // // console.log(AWS.config.credentials)

            //   // // // // console.log(uid)
            //   // getUser(uid).then(function(response){

            //   //       var status = false
            //   //       if (response) {
            //   //         // user exists in cog and in db
            //   //         response = response.Item
            //   //         if (response) {
            //   //           status = true
            //   //         }
            //   //       }
            //   //       // // // // console.log(status)
            //   //       if (status) {
            //   //         // login facebook user
            //   //         // // // // console.log('OH YEAH BABY')
            //   //         // $.post( "/login.php", { login: uid, fb: '1' })
            //   //         // .done(function( data ) {
            //   //           // window.location = "/"
            //   //         // })
            //   //       }else{
            //   //         // create facebook user
            //   //         createFacebookUser()
            //   //         // $scope.fbcreate(uid, $scope.name, $scope.picture).then(function(response){
            //   //           // // // // console.log($scope.name)
            //   //           // // // // console.log($scope.picture)
            //   //           // $.post( "/login.php", { login: uid, fb: '1' })
            //   //           // .done(function( data ) {
            //   //             // window.location = "/"
            //   //           // })
            //   //         // })

            //   //       }
            //   //     })
            // })
          },
          err => {

          }
        )

        // FB.api('/me', { fields: 'id, name, email' }, function(response) {
        //     picture = 'https://graph.facebook.com/' + response.id + '/picture?width=9999'
        //     name = response.name
        //     email = response.email


        //     // // // // console.log(picture)


        // })


        //  $scope.fbsignin()
      } else {
        alertwindowservice.showDataWithButton('Facebook login cancelled')
        // // // console.log('User cancelled login or did not fully authorize.')
      }
    }, { scope: 'public_profile,email' })
    // window.fbAsyncInit = function() {
    //   FB.init({
    //     appId            : '775129399312429',
    //     autoLogAppEvents : true,
    //     xfbml            : true,
    //     version          : 'v2.10',
    //     display          : 'touch',
    //     status           : true
    //   })
    // FB.AppEvents.logPageView()
    // FB.getLoginStatus(function(response) {
    //   if (response.status === 'connected') {
    //     // // // console.log(response)
    //     // // // console.log(response.authResponse.accessToken)


    //     AWS.config.region = 'us-east-1'

    //     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //       IdentityPoolId: this.identityPoolId,
    //       Logins: {
    //         'graph.facebook.com': response.authResponse.accessToken
    //       }
    //     })

    //     FB.api('/me', { fields: 'id, name, email' }, function(response) 
    //     {
    //         picture = 'https://graph.facebook.com/' + response.id + '/picture?width=9999'
    //         name = response.name

    //         var getUser = (uid) => {
    //           return this.getUser(uid)
    //         }

    //         var createFacebookUser = () =>{
    //           this.createUserFromFacebook()
    //         }

    //         AWS.config.credentials.get(function(){
    //             // // // console.log(AWS.config.credentials)
    //             var uid = AWS.config.credentials.data.IdentityId
    //             getUser(uid).then(function(response){

    //                   var status = false
    //                   if (response) {
    //                     // user exists in cog and in db
    //                     response = response.Item
    //                     if (response) {
    //                       status = true
    //                     }
    //                   }
    //                   // // // // console.log(status)
    //                   if (status) {
    //                     // login facebook user
    //                     // // // // console.log('OH YEAH BABY')
    //                     // $.post( "/login.php", { login: uid, fb: '1' })
    //                     // .done(function( data ) {
    //                       // window.location = "/"
    //                     // })
    //                   }else{
    //                     // create facebook user
    //                     createFacebookUser()
    //                     // $scope.fbcreate(uid, $scope.name, $scope.picture).then(function(response){
    //                       // // // // console.log($scope.name)
    //                       // // // // console.log($scope.picture)
    //                       // $.post( "/login.php", { login: uid, fb: '1' })
    //                       // .done(function( data ) {
    //                         // window.location = "/"
    //                       // })
    //                     // })

    //                   }
    //                 })
    //         })

    //     })

    //   // Obtain AWS credentials



    //   }else {
    //     FB.login(function(response) {
    //         if (response.authResponse) {
    //         //  $scope.fbsignin()
    //         } else {
    //          // // // console.log('User cancelled login or did not fully authorize.')
    //         }
    //     }, {scope: 'public_profile,email'})
    //   }
    // })
    // }
    // app.controller('facebook', ['$scope', '$http', function($scope, $http) {
    //       $scope.count = 0
    //       $scope.cognitoUser
    //       $scope.displayname
    //       $scope.userpoolid = 'us-east-1_na5sZOvyN'
    //       $scope.clientid = '6sqkbatu0tgo4lciv2l5is8mtk'
    //       $scope.identitypoolid = 'us-east-1:5a5c2a67-22e7-436c-8bce-a77322a4d11f'
    //       $scope.name = 'John Doe'
    //       $scope.picture = 'https://s3.amazonaws.com/myintro-profiles/default.jpg'
    //       $scope.prevent = {
    //         submit: function(){
    //           return false
    //         }
    //       }

    //       $scope.fbsignin = function(){
    // // // // console.log('clicked')


    // }
    // }])

    // (function(d, s, id){
    //    var js, fjs = d.getElementsByTagName(s)[0]
    //    if (d.getElementById(id)) {return}
    //    js = d.createElement(s) js.id = id
    //    js.src = "//connect.facebook.net/en_US/sdk.js"
    //    fjs.parentNode.insertBefore(js, fjs)
    //  }(document, 'script', 'facebook-jssdk'))
  }

  setLocalUser(user: AuthUser) {
    this.localUserSource.next(user)
  }

  goHome() {
    this.router.navigateByUrl('/profile/' + this.getUserFromSession().get('username'))
  }

  setAuthUser(user: any) {
    // // // console.log(user)
    let newUser: Object = new Object()
    Object.keys(user).map(key => {
      newUser[key] = user[key]
    })

    let authUser: AuthUser = new AuthUser(newUser)
    // // // console.log(authUser)
    this.createLoginSession(authUser.get('uid'), authUser)
    let profile = '/profile/'
    // console.log('is onboarded', authUser)
    if(authUser.get('isOnboarded') == true || authUser.get('isOnboarded') == 'true'){
      window.location.href = profile + authUser.get('username')
    }else{
      window.location.href = profile + authUser.get('username') + '/editvideo'
    }
  }

  refreshCodes = {}
  refreshAuthUser(code?:number) {
    try {
      let user: AuthUser = new AuthUser(JSON.parse(localStorage.getItem('authSession')).user)
      // // // console.log(user)
      let uid = user.get('uid')
      // // // console.log('reached')
      let auth = user.get('authToken')
      // // // // console.log('reached')
      this.getUserAsAuth(uid, auth).then(
        res => {
          let authUser: AuthUser = new AuthUser(res['body']['Item'])
          // // // console.log(authUser)
          this.createLoginSession(authUser.get('uid'), authUser)
        },
        err => {
          // // // console.log(err)
        }
      )
      // // // console.log(user)
    } catch (e) {

    }

    if(code){
      this.refreshCodes[code] = {
        inUse: true
      }
    }


  }

  setUser(user: any, uid: string, accessToken: string, email: string) {
    // // // // console.log(user)
    user = user.body.Item
    user = {
      userName: uid.substring(uid.indexOf(':') + 1),
      displayName: user.displayName,
      location: user.location,
      authToken: accessToken,
      region: 'us-east-1:',
      email: email,
      avatar: user.profileThumbnailURL,
      education: user.education,
      currentCompany: user.currentCompany,
      industry: user.industry,
      title: user.title
    }
    this.createLoginSession(uid, user)
    let profile = 'profile/'
    // // // // console.log(localStorage.getItem('authSession'))
    // // // // console.log(JSON.parse(localStorage.getItem('authSession')).user.avatar)
    // this.router.navigateByUrl(profile + user.userName)
    // this.router.navigate([profile + user.userName])
    window.location.href = profile + user.userName
  }

  getUserFromSession() {
    try {
      return new AuthUser(JSON.parse(localStorage.getItem('authSession')).user)
    } catch (e) {
      return null
    }
  }

  logout() {
    localStorage.clear()
    this.alertwindowservice.showDataWithoutButton('Logging out')
    setTimeout(() => {
      this.router.navigateByUrl('signin')
    }, 400)
  }

  signUp(displayName: string, userName: string, password: string, email: string, terms: boolean) {
    if (terms) {
      AWSCognito.config.region = 'us-east-1'

      var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData)

      var userData = {
        Username: userName,
        Pool: userPool
      }

      var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData)

      var attributeList = []

      var dataEmail = {
        Name: 'email',
        Value: email
      }

      var dataName = {
        Name: 'name',
        Value: displayName
      }
      var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail)
      var attributeName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataName)

      attributeList.push(attributeEmail)
      attributeList.push(attributeName)


      // // // // console.log(cognitoUser)

      var router = this.router
      var selectAuthPage = (page) => {
        this.selectAuthPage(page)
      }
      this.alertwindowservice.showDataWithoutButton('Signing Up... Please wait')
      userPool.signUp(userName, password, attributeList, null, (err, result) => {
        if (err) {
          // this.alertwindowservice.showDataWithButton('An error has occurred: ' + err)
          // console.log('res', result)
          console.log('err', JSON.stringify(err))
          // console.log('errcode', err.code)
          if (err.code) {
            switch (err.code) {
              case 'UsernameExistsException':
                this.alertwindowservice.showDataWithButton('An account with this username already exists.')
                break
              case 'InvalidPasswordException':
                this.alertwindowservice.showDataWithButton('Your password is unsecure. Make sure you have at least 6 characters, 1 capital letter,  and 1 special character.')
                break
              default:
                this.alertwindowservice.showDataWithButton('An error has occurred: ' + err)
            }
          } else {
            console.log('err', JSON.stringify(err))
          }
          return
        } else {
          // // // // console.log(cognitoUser)
          selectAuthPage('confirm')
          window.history.pushState(null, "Confirm Registration", 'signup/confirm')
          this.alertwindowservice.hide()
        }
      })
    } else {
      let err = new Error(JSON.stringify({
        statusCode: 400
      }))
      return err
    }
  }

  selectAuthPage(page) {
    this.selectedPageSource.next(page)
  }

  prevSelectedAuthPage(page) {
    this.prevSelectedPageSource.next(page)
  }

  confirm(userName: string, secret: string) {

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData)

    var userData = {
      Username: userName,
      Pool: userPool
    }

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData)

    var identityPoolId = this.identityPoolId
    var router = this.router
    var selectAuthPage = (page) => {
      this.selectAuthPage(page)
    }
    var alertwindowservice = this.alertwindowservice
    cognitoUser.confirmRegistration(secret, true, function (err, result) {
      if (err) {
        // alertwindowservice.showDataWithButton('Already confirmed. Go ahead and sign in.')
        selectAuthPage('email')
        window.history.pushState(null, "Sign In", 'signin/email')
        return
      } else {
        // // // // console.log(result)
        // router.navigateByUrl('signin')
        selectAuthPage('email')
        window.history.pushState(null, "Sign In", 'signin/email')
        // navigate user to signin page
      }
    })
  }

  forgot(userName: string) {

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData)
    var userData = {
      Username: userName,
      Pool: userPool
    }

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData)

    let selectAuthPage = page => {
      this.selectAuthPage(page)
    }

    let alertwindowservice = this.alertwindowservice

    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        // console.log('reached')
        // navigate user to rememeber page (password reset)
      },
      onFailure: function (err) {
        let str: string = JSON.stringify(err)
        if (str.indexOf('LimitExceededException') != -1) {
          alertwindowservice.showDataWithButton('Too many attempts, please try again later.')
        } else {
          alertwindowservice.showDataWithButton('An error has occurred. Please try again later.')
        }
      },
      inputVerificationCode() {
        alertwindowservice.showDataWithButton('Check your email to obtain your verification code.')
        localStorage.setItem('forgottenUser', userName)
        selectAuthPage('remember')
        window.history.pushState(null, "Create New Password", 'signin/remember')
      }
    })
  }

  remember(verification: string, password: string) {
    this.alertwindowservice.showDataWithoutButton('Checking... Please wait.')
    let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData)
    let userName = localStorage.getItem('forgottenUser')

    let login = (userName: string, password: string) => {
      this.login(userName, password)
    }

    if (userName) {
      let userData = {
        Username: userName,
        Pool: userPool
      }

      let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData)

      cognitoUser.confirmPassword(verification, password, {
        onSuccess: () => {
          login(userName, password)
        },
        onFailure: (err) => {
          
          console.log('err', JSON.stringify(err))

          if (err.code) {
            switch (err.code) {
              case 'InvalidParameterException':
              case 'InvalidPasswordException':
                this.alertwindowservice.showDataWithButton('Your password is unsecure. Make sure you have at least 6 characters, 1 capital letter,  and 1 special character.')
                break
              default:
                this.alertwindowservice.showDataWithButton('An error has occurred: ' + err)
            }
          } else {
            console.log('err', JSON.stringify(err))
          }
          return

          // this.alertwindowservice.showDataWithButton('Check that you\'ve entered a valid verification code then try again.')
        }
      })

    }

  }

}
