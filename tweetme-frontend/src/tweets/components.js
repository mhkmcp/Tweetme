import React, { useEffect, useState } from 'react'

import { apiTweetCreate, apiTweetList, apiTweetAction } from './lookup'


export function TweetsComponent(props) {
    const textAreaRef = React.createRef()
    const [newTweets, setNewTweets] = useState([])

    const canTweet = props.canCreate === "false" ? false : true

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
        apiTweetCreate(newVal, handleBackendUpdate)
        textAreaRef.current.value = ''
    }

    return <div className='col-10 mb-3 mx-auto'>
        {canTweet === true && <div className='col-8 mb-3 mx-auto'>
            <h2>Welcome to Tweetme</h2>
            <form onSubmit={handleSubmit}>
                <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'>
                </textarea>
                <button type='submit' className='btn btn-sm btn-outline-success my-3'>Tweet</button>
            </form>
        </div>
        }
        <TweetList newTweets={newTweets} {...props} />
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
            apiTweetList(props.username, myCallback)
        }
    }, [tweetsInit, tweetsDidSet, setTweetDidSet, props.username])

    const handleDidRetweet = (newTweet) => {
        const updatedTweetsInit = [...tweetsInit]
        updatedTweetsInit.unshift(newTweet)
        setTweetsInit(updatedTweetsInit)

        const updatedFinalTweets = [...tweets]
        updatedFinalTweets.unshift(tweets)
        setTweets(updatedFinalTweets)
    }

    return tweets.map((item, index) => {
        return <Tweet
            tweet={item}
            didRetweet={handleDidRetweet}
            className='my-5 py-3 border bg-white text-dark'
            key={`${index}-{item.id}`} />
    })
}


export function ActionBtn(props) {
    const { tweet, action, didPerformAction } = props
    const likes = tweet.likes ? tweet.likes : 0
    // const [likes, setLikes] = useState()
    // const [userLike, setUserLike] = useState(tweet.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn btn-outline-info btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'

    const handleActionBackendEvent = (response, status) => {
        console.log(response, status)
        if ((status === 200 || status === 201) && didPerformAction) {
            didPerformAction(response, status)
        }
    }

    const handleClick = (event) => {
        event.preventDefault()
        apiTweetAction(tweet.id, action.type, handleActionBackendEvent)
    }

    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return <button className={className} onClick={handleClick}>{display}</button>
}

export function ParentTweet(props) {
    const { tweet } = props

    return tweet.parent ? <div className={'row'}>
        <div className='col-10 mx-auto p-3 border rounded'>
            <p className='mb-0 text-muted small'>Retweet</p>
            <Tweet hideActions className={''} tweet={tweet.parent} />
        </div>
    </div> : null

}
export function Tweet(props) {
    const { tweet, didRetweet, hideActions } = props
    const [actionTweet, setActionTweet] = useState(props.tweet ? props.tweet : null)
    const className = props.className ? props.className : 'col-8 mx-auto col-md-6'

    const handlePerformAction = (newActionTweet, status) => {
        if (status === 200) {
            setActionTweet(newActionTweet)
        }
        else if (status === 201) {
            if (didRetweet) {
                didRetweet(newActionTweet)
            }
        }
    }

    return <div className={className}>
        <div>
            <p>{tweet.id} - {tweet.content}</p>
            <ParentTweet tweet={tweet} />
        </div>
        {(actionTweet && hideActions !== true) && <div className='btn btn-group'>
            <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} className={'btn btn-outline-success btn-sm'} action={{ type: "like", display: "Likes" }} />
            <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} className={'btn btn-outline-primary btn-sm'} action={{ type: "unlike", display: "Unlike" }} />
            <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} className={'btn btn-outline-info btn-sm'} action={{ type: "retweet", display: "Retweet" }} />
        </div>
        }
    </div>
}