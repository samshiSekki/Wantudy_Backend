const mongoose = require("mongoose");
const commentList = require('../models/comment');
const recommentList = require('../models/recomment')
const path = require('path');
const logger = require('../.config/winston');


//댓글 작성
exports.writeComment = async (req, res) => {
    const { userId, content } = req.body;
    const { studyId } = req.params;

    try {
        // const check = await commentList.findOne({ userId: userId, studyId: studyId })
        // if (check) {
        //     const commentupdate = await commentList.findOneAndUpdate({ userId: userId, studyId: studyId },
        //         {
        //             $push: {
        //                 content: req.body.content
        //             },//댓글 배열에 새로운 댓글 추가
        //             updated: Date.now()
        //         },
        //         { new: true })
        //         .exec();
        //     return res
        //         .status(200)
        //         .json(commentupdate)
        // }
        const comment = new commentList({
            userId,
            studyId,
            content,
        })
        await comment.save();
        return res
            .status(200)
            .json(comment)
    } catch (err) {
        logger.error("댓글 저장 error : " + err)
        throw res.status(500).json({ error: err })
    }
};


//대댓글 작성
exports.reComment = async (req, res) => {
    const { userId, content } = req.body;
    const { commentId } = req.params;

    try {
        parent = await commentList.findById(commentId)
        const recomment = new recommentList({
            userId,
            content,
            parentComment: commentId,
            studyId: parent.studyId
        })
        await recomment.save()
        return res
            .status(200)
            .json(recomment);
    } catch (err) {
        logger.error("대댓글 저장 error : " + err)
        throw res.status(500).json({ error: err })
    }
};

//댓글 삭제
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const parent = await commentList.findById(commentId)
        const child = await recommentList.findById(commentId)
        
        if(parent){
            await commentList.findByIdAndDelete(commentId)
        }
        else if(child){
            await recommentList.findByIdAndDelete(commentId)
        }
        else{
            return res.status(404).json({msg:'없는 댓글'})
        }
        return res.status(204).json({ msg: '삭제 성공' });
    } catch (err) {
        throw res.status(500).json({ error: err })
    }
}

//댓글 수정
exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body

    try {
        const comment = await commentList.findByIdAndUpdate(commentId, {
            $set: {
                content: content
            },
            updated: Date.now()
        },
            { new: true })
            .exec();
        if (!comment) {
            return res.status(404)
        }
        return res
            .status(200)
            .json(comment)
    } catch (err) {
        throw res.status(500).json({ error: err })
    }
};
