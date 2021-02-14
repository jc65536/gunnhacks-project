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
    pose = pose.keypoints
    var obj = pose.find(o => o.part === part);
    if (obj.score > 0.1) {
        return obj.position
    } else {
        return null;
    }
}

class Workout extends React.Component {

    doWorkout() {
        this.setState({running: false})
        this.video.srcObject.getTracks().forEach(function (track) {
            track.stop();
        });
        authFetch("/api/setstats", {
            method: 'post',
            body: JSON.stringify({
                reps: {
                    squats: this.state.squatReps,
                    jumpingJacks: this.state.jumpingJackReps
                },
                date: new Date().toISOString(),
                calories: this.state.calories
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
        outputStride: 16,
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
            squatKeyPos: 0,
            jumpingKeyPos: 0,
            squatReps: 0,
            jumpingJackReps: 0,
            hkdist: 0,
            thighLen: 0,
            angle: 0,
            torsoSize: 0,
            weight: 0,
            height: 0,
            calories: 0,
            lowest: 10000000000,
            pxHeight: 0,
            animation: null,
            running: true
        }

        this.doWorkout = this.doWorkout.bind(this);
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

        authFetch("/api/getuser").then(response => {
            if (response.status === 401) {
                console.log("Sorry you aren't authorized!")
                return null
            }
            return response.json();
        }).then(response => {
            if (response) {
                console.log(response);
                this.setState({ weight: response.weight })
                this.setState({ height: response.height });
            }
        })

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

    drawPoint(canvasContext, x, y, radius = 3, color = "chartreuse") {
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
        canvasContext.fillStyle = color;
        canvasContext.fill();
        canvasContext.fillStyle = 'black';
    }

    drawSegment(canvasContext, [ax, ay], [bx, by], lineWidth = 3, color = "chartreuse") {
        canvasContext.beginPath();
        canvasContext.moveTo(ax, ay);
        canvasContext.lineTo(bx, by);
        canvasContext.lineWidth = lineWidth;
        canvasContext.strokeStyle = color;
        canvasContext.stroke();
    }

    distance([ax, ay], [bx, by]) {
        return Math.hypot(ax - bx, ay - by);
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
                //canvasContext.scale(-1, 1)
                //canvasContext.translate(-videoWidth, 0)
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
                rshoulder: getPartPosition(pose, "rightShoulder"),
                lankle: getPartPosition(pose, "leftAnkle"),
                rankle: getPartPosition(pose, "rightAnkle"),
                eye: getPartPosition(pose, "rightEye")
            }
            if (!pos.lhip || !pos.rhip || !pos.lknee || !pos.rknee || !pos.lshoulder || !pos.rshoulder || !pos.rankle || !pos.lankle || !pos.eye) {
                this.setState({ ready: false });
            } else if (!this.state.ready) {
                // sets these only once (when you stand in front of the camera)
                this.setState({ ready: true });
                this.setState({ thighLen: Math.abs(pos.rhip.y - pos.rknee.y) })
                this.setState({ pxHeight: Math.abs(pos.eye.y - pos.rankle.y) })
            }
            if (this.state.ready) {
                var hipKneeDist = Math.abs(pos.rhip.y - pos.rknee.y)
                var newTorsoSize = Math.abs(pos.rshoulder.x - pos.lshoulder.x);
                if (Math.abs(newTorsoSize - this.state.torsoSize) / this.state.torsoSize > 0.3) {
                    this.setState({ torsoSize: newTorsoSize });
                    this.setState({ thighLen: Math.abs(pos.rhip.y - pos.rknee.y) })
                    this.setState({ pxHeight: Math.abs(pos.eye.y - pos.rankle.y) })
                }
                this.setState({ hkdist: hipKneeDist });
                const rightPosition = [pos.rankle.x, pos.rankle.y];
                const leftPosition = [pos.lankle.x, pos.lankle.y];
                const midpointHips = [(pos.lhip.x + pos.rhip.x) / 2, (pos.lhip.y + pos.rhip.y) / 2];
                const a = this.distance(midpointHips, rightPosition);
                const b = this.distance(midpointHips, leftPosition);
                this.setState({
                    angle: Math.acos(
                        (Math.pow(this.distance(leftPosition, rightPosition), 2) - Math.pow(a, 2) - Math.pow(b, 2))
                        / (-2 * a * b)
                    ) * 180. / Math.PI
                });
                this.setState({ lowest: Math.min(this.state.lowest, Math.abs(pos.eye.y - pos.rankle.y)) })
                switch (this.state.squatKeyPos) {
                    case 0:
                        if (hipKneeDist <= 0.5 * this.state.thighLen) {
                            this.setState({ squatKeyPos: 1 });
                        }
                        break;
                    case 1:
                        if (hipKneeDist / this.state.thighLen >= 0.9) {
                            this.setState({ squatKeyPos: 0 });
                            this.setState({ squatReps: this.state.squatReps + 1 });
                            var delta = 0;
                            delta = this.state.weight * 10 * ((this.state.pxHeight - this.state.lowest) / this.state.pxHeight * this.state.height) * 0.000239006;
                            
                            this.setState({ calories: this.state.calories + delta })
                            this.setState({ lowest: 10000000000 });
                        }
                        break;
                }
                switch (this.state.jumpingKeyPos) {
                    case 0:
                        if (this.state.angle >= 35) {
                            this.setState({ jumpingKeyPos: 1 });
                        }
                        break;
                    case 1:
                        if (this.state.angle <= 15) {
                            this.setState({ jumpingKeyPos: 0 });
                            this.setState({ jumpingJackReps: this.state.jumpingJackReps + 1 });
                            delta = this.state.weight * 10 * ((this.state.pxHeight - this.state.lowest) / this.state.pxHeight * this.state.height) * 0.000239006;
                            this.setState({ calories: this.state.calories + delta })
                            this.setState({ lowest: 10000000000 });
                        }
                        break;
                }
            }

            if (showPoints) {
                for (var i = 0; i < pose.keypoints.length; i++) {
                    const keypoint = pose.keypoints[i];
                    if (keypoint.score < minPartConfidence) {
                        continue;
                    }

                    this.drawPoint(canvasContext, keypoint['position']['x'], keypoint['position']['y']);
                }
            }

            if (showSkeleton) {
                const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, minPartConfidence);

                adjacentKeyPoints.forEach((keypoints) => {
                    this.drawSegment(canvasContext, [keypoints[0].position.x, keypoints[0].position.y],
                        [keypoints[1].position.x, keypoints[1].position.y]);
                });
            }
            if (this.state.running)
                requestAnimationFrame(findPoseDetectionFrame)
        }
        findPoseDetectionFrame()
    }

    render() {
        return (
            <div>
                <h1>Workout</h1>
                {!this.state.running ? <Redirect to="/dashboard"/> : ""}
                <div>
                    <video id="videoNoShow" playsInline ref={this.getVideo} style={{
                        display: "none"
                    }} />
                    <canvas className="webcam" ref={this.getCanvas} />
                </div>
                <h2>{this.state.ready ? "START" : "Stand up upright with your entire body in the frame"}</h2>
                <h2>Squat Reps: {this.state.squatReps}</h2>
                <h2>Jumping Jack Reps: {this.state.jumpingJackReps}</h2>
                <h2>Calories: {this.state.calories.toFixed(2)}</h2>
                <input type="button" value="End workout" onClick={this.doWorkout} />
            </div>
        )
    }
}

export default Workout;