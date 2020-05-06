// import React, { useEffect, useState } from 'react'

// import { loadTweets } from '../lookup'


// export function TweetsComponent(props) {
//     const textAreaRef = React.createRef()
//     const [newTweets, setNewTweets] = useState([])
//     const handleSubmit = (event) => {
//         event.preventDefault()
//         const newVal = textAreaRef.current.value
//         let tempNewTweets = [...newTweets]
//         // unshift add to start of the array
//         tempNewTweets.unshift({
//             content: newVal,
//             likes: 0,
//             id: 12
//         })
//         setNewTweets(tempNewTweets)
//         console.log(newVal)
//         textAreaRef.current.value = ''
//     }

//     return <div className={props.className}>
//         <div className="col-12 mb-3">
//             <form onSubmit={handleSubmit}>
//                 <textarea ref={textAreaRef} required={true} className='form-control' name='tweet' placeholder='Tweet Here'></textarea>
//                 <button type="submit" className='btn btn-primary'>Tweet</button>
//             </form>
//         </div>
//         <TweetList newTweets={newTweets} />
//     </div>
// }

// export function TweetList(props) {
//     const [tweetsInit, setTweetsInit] = useState([])
//     const [tweets, setTweets] = useState([])
//     console.log(props.newTweets)
//     useEffect(() => {
//         const final = [...props.newTweets].concat(tweetsInit)
//         if (final.length !== tweets.length) {
//             setTweets(final)
//         }
//     }, [props.newTweets, tweets, tweetsInit])
//     useEffect(() => {
//         const myCallback = (response, status) => {
//             if (status === 200) {
//                 // const finalTweetsInit = [...response].concat(tweetsInit)
//                 setTweetsInit(response)
//             }
//         }
//         loadTweets(myCallback)
//     }, [tweetsInit])

//     return tweets.map((item, index) => {
//         return <Tweet tweet={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-{item.id}`} />
//     })
// }

// export function ActionBtn(props) {
//     const { tweet, action } = props
//     const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
//     const [isClicked, setIsClicked] = useState(tweet.isClicked === true ? true : false)

//     const classNames = props.className ? props.className : 'btn btn-sm btn-outline-info'
//     const actionDisplay = action.display ? action.display : 'Action'
//     const handleClick = (event) => {
//         event.preventDefault()
//         if (action.type === 'like') {
//             if (isClicked === true) {
//                 setLikes(likes - 1)
//                 setIsClicked(false)
//             }
//             else {
//                 setLikes(likes + 1)
//                 setIsClicked(true)
//             }
//             setIsClicked(!isClicked)
//         }
//     }

//     const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
//     return <button className={classNames} onClick={handleClick}>{display}</button>
// }


// export function Tweet(props) {
//     const { tweet } = props
//     const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
//     return <div className={className}>
//         <p>{tweet.id} - {tweet.content}</p>
//         <div className='btn btn-sm btn-group'>
//             <ActionBtn tweet={tweet} action={{ type: "like", display: "Likes" }} />
//             <ActionBtn tweet={tweet} action={{ type: "unlike", display: "Unlike" }} />
//             <ActionBtn tweet={tweet} action={{ type: "retweet", display: "Retweet" }} />
//         </div>
//     </div>
// }


import React, { useEffect, useState } from 'react'

import { createTweet, loadTweets } from '../lookup'

export function TweetsComponent(props) {
    const textAreaRef = React.createRef()
    const [newTweets, setNewTweets] = useState([])

    const handleBackendUpdate = (response, status) => {
        // backend api response handler
        let tempNewTweets = [...newTweets]
        if (status === 201) {
            tempNewTweets.unshift(response)
            setNewTweets(tempNewTweets)
        }
        else {
            console.log(response)
            alert("An error occured please try again")
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const newVal = textAreaRef.current.value
        // backend api requests
        createTweet(newVal, handleBackendUpdate)
        textAreaRef.current.value = ''
    }

    return <div className='col-10 mb-3 mx-auto'>
        <div className='col-8 mb-3 mx-auto'>
            <h2>Welcome to Tweetme</h2>
            <form onSubmit={handleSubmit}>
                <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'>
                </textarea>
                <button type='submit' className='btn btn-sm btn-outline-success my-3'>Tweet</button>
            </form>
        </div>
        <TweetList newTweets={newTweets} />
    </div>
}

export function TweetList(props) {
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])
    const [tweetsDidSet, setTweetDidSet] = useState(false)

    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit)
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [props.newTweets, tweets, tweetsInit])

    useEffect(() => {
        if (tweetsDidSet === false) {
            const myCallback = (response, status) => {
                if (status === 200) {
                    setTweetsInit(response)
                    setTweetDidSet(true)
                } else {
                    alert("There was an error")
                }
            }
            loadTweets(myCallback)
        }
    }, [tweetsInit, tweetsDidSet, setTweetDidSet])
    return tweets.map((item, index) => {
        return <Tweet tweet={item} className='my-5 py-3 border bg-white text-dark' key={`${index}-{item.id}`} />
    })
}


export function ActionBtn(props) {
    const { tweet, action } = props
    const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
    const [userLike, setUserLike] = useState(tweet.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn btn-outline-info btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'

    const handleClick = (event) => {
        event.preventDefault()
        if (action.type === 'like') {
            if (userLike === true) {
                // perhaps i Unlike it?
                setLikes(likes - 1)
                setUserLike(false)
            } else {
                setLikes(likes + 1)
                setUserLike(true)
            }
        }
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return <button className={className} onClick={handleClick}>{display}</button>
}

export function Tweet(props) {
    const { tweet } = props
    const className = props.className ? props.className : 'col-8 mx-auto col-md-6'
    return <div className={className}>
        <p>{tweet.id} - {tweet.content}</p>
        <div className='btn btn-group'>
            <ActionBtn className={'btn btn-outline-success btn-sm'} tweet={tweet} action={{ type: "like", display: "Likes" }} />
            <ActionBtn className={'btn btn-outline-primary btn-sm'} tweet={tweet} action={{ type: "unlike", display: "Unlike" }} />
            <ActionBtn className={'btn btn-outline-info btn-sm'} tweet={tweet} action={{ type: "retweet", display: "Retweet" }} />
        </div>
    </div>
}