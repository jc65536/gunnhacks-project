import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"
import { login, authFetch, useAuth, logout } from "../auth"
import * as posenet from "@tensorflow-models/posenet"
import * as tfjs from '@tensorflow/tfjs';

function getPartPosition(pose, part) {
    var obj = pose.find(o => o.part === part);
    if (obj.score > 0.1) {
        return obj.position
    } else {
        return null;
    }
}

class Workout extends React.Component {

    doWorkout() {
        authFetch("/api/setstats", {
            method: 'post',
            body: JSON.stringify({
                reps: {
                    squats: 2,
                    jumpingJacks: 4
                },
                date: new Date().toISOString(),
                calories: 400
            })
        }).then(response => {

            return response.json();
        }).then(response => {
            console.log(response)
        })
    }

    static defaultProps = {
        videoWidth: 500,
        videoHeight: 500,
        flipHorizontal: true,
        showVideo: true,
        showSkeleton: true,
        showPoints: true,
        minPoseConfidence: 0.1,
        minPartConfidence: 0.5,
        maxPoseDetections: 2,
        nmsRadius: 20,
        outputStride: 32,
        imageScaleFactor: 0.5,
        skeletonColor: '#ffadea',
        skeletonLineWidth: 6,
        loadingText: 'Loading...please be patient...'
    }

    constructor(props) {
        super(props)
        this.state = {
            t1: performance.now(),
            ready: false,
            keyPos: 0,
            reps: 0
        }
    }

    getCanvas = elem => {
        this.canvas = elem
    }

    getVideo = elem => {
        this.video = elem
    }

    async componentDidMount() {
        try {
            await this.setupCamera()
        } catch (error) {
            throw new Error(
                'This browser does not support video capture, or this device does not have a camera'
            )
        }

        try {
            this.posenet = await posenet.load()
        } catch (error) {
            throw new Error('PoseNet failed to load')
        } finally {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 200)
        }

        this.detectPose()
    }

    async setupCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(
                'Browser API navigator.mediaDevices.getUserMedia not available'
            )
        }
        const { videoWidth, videoHeight } = this.props
        const video = this.video
        video.width = videoWidth
        video.height = videoHeight

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'user',
                width: videoWidth,
                height: videoHeight
            }
        })

        video.srcObject = stream

        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                video.play()
                resolve(video)
            }
        })
    }

    detectPose() {
        const { videoWidth, videoHeight } = this.props
        const canvas = this.canvas
        const canvasContext = canvas.getContext('2d')

        canvas.width = videoWidth
        canvas.height = videoHeight

        this.poseDetectionFrame(canvasContext)
    }


    poseDetectionFrame(canvasContext) {
        const {
            imageScaleFactor,
            flipHorizontal,
            outputStride,
            minPoseConfidence,
            minPartConfidence,
            maxPoseDetections,
            nmsRadius,
            videoWidth,
            videoHeight,
            showVideo,
            showPoints,
            showSkeleton,
            skeletonColor,
            skeletonLineWidth
        } = this.props

        const posenetModel = this.posenet
        const video = this.video

        const findPoseDetectionFrame = async () => {

            const pose = await posenetModel.estimateSinglePose(
                video,
                imageScaleFactor,
                flipHorizontal,
                outputStride
            )

            canvasContext.clearRect(0, 0, videoWidth, videoHeight)

            if (showVideo) {
                canvasContext.save()
                canvasContext.scale(-1, 1)
                canvasContext.translate(-videoWidth, 0)
                canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight)
                canvasContext.restore()
            }

            // WIP squat detection
            var pos = {
                lhip: getPartPosition(pose, "leftHip"),
                rhip: getPartPosition(pose, "rightHip"),
                lknee: getPartPosition(pose, "leftKnee"),
                rknee: getPartPosition(pose, "rightKnee"),
                lshoulder: getPartPosition(pose, "leftShoulder"),
                rshoulder: getPartPosition(pose, "rightShoulder")
            }
            var thighLen = 0;
            if (!pos.lHip || !pos.rhip || !pos.lknee || !pos.rknee || !pos.lshoulder || !pos.rshoulder) {
                this.setState({ready: false});
            } else if (!this.state.ready) {
                // sets these only once (when you stand in front of the camera)
                this.setState({ready: true});
                thighLen = Math.abs(pos.rhip.y - pos.lhip.y);
            }
            var hipKneeDist = Math.abs(pos.rhip.y - pos.rknee.y)
            switch (this.state.keyPos) {
                case 0:
                    if (hipKneeDist <= 0.5 * thighLen) {
                        this.setState({keyPos: 1});
                    }
                    break;
                case 1:
                    if ((thighLen - hipKneeDist) / thighLen >= 0.9) {
                        this.setState({keyPos: 0});
                        this.setState({reps: this.state.reps + 1});
                    } 
                    break;
            }

            var t2 = performance.now();

            console.log(1000 / (t2 - this.state.t1));
            this.setState({t1: t2})
            requestAnimationFrame(findPoseDetectionFrame)
        }
        findPoseDetectionFrame()
    }

    render() {
        return (
            <div>
                <div>
                    <video id="videoNoShow" playsInline ref={this.getVideo} style={{
                        display: "none"
                    }} />
                    <canvas className="webcam" ref={this.getCanvas} />
                </div>
                <h1>{this.state.ready ? "START" : "Stand up upright with your entire body in the frame"}</h1>
                <h1>Reps: {this.state.reps}</h1>
            </div>
        )
    }
}

export default Workout;