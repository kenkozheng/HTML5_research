/**
 * spine renderer plugin for min2d engine
 * Created by kenkozheng on 2016/1/22.
 */

(function() {

    /**
     * @param {String} atlas
     * @param {String} json
     * @param {Image} image
     * @constructor
     */
    var Spine = function(atlas, json, image) {
        this.initialize(atlas, json, image);
    };
    var p = Spine.prototype = new min2d.Container();

// public properties:

    /**
     * just expose the interface of Spine Engine
     */
    p.state = null;
    p.stateData = null;
    p.skeleton = null;

    p.Container_initialize = p.initialize;

    //todo 临时扩展Sprite
    min2d.Sprite.prototype.initialize = function(image, fpsOrRect) {
        this.DisplayObject_initialize();
        var that = this;
        if(typeof image == 'string'){
            that._setImage(image);
        }else if(image.src){
            that.image = image; //是个图片
            that.rect = fpsOrRect;
        }else{
            var index = 0;
            var frames = image;
            that._setImage(frames[0]);
            var timer = new min2d.Timer(fpsOrRect, function () {
                index = (index + 1) % frames.length;
                that._setImage(frames[index]);
            });
            timer.start();
        }
    };

    p.initialize = function(atlas, json, image) {
        var that = this;
        that.Container_initialize();

        spine.Bone.yDown = true;
        var textureLoader = {load:function(page,path,atlas){}, unload:function(){}};
        var spineAtlas = new spine.Atlas(atlas, textureLoader);    //初始化的解析过程中，会调用load，再返回。实际目的是，刚解析出关联的图片，马上加载图片，但我们已经提前加载好了。

        var jsonSkeleton = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(spineAtlas));
        var skeletonData = jsonSkeleton.readSkeletonData(JSON.parse(json));

        that.skeleton = new spine.Skeleton(skeletonData);
        that.skeleton.updateWorldTransform();

        that.stateData = new spine.AnimationStateData(skeletonData);
        that.state = new spine.AnimationState(this.stateData);

        for (var i = 0; i < spineAtlas.regions.length; i++) {
            var region = spineAtlas.regions[i];
            var bone = new min2d.Container();            //需要两层的显示列表，分别代表bone和attachment
            bone.name = region.name;
            var attachment = new min2d.Sprite(image, {x:region.x, y:region.y, w:region.width, h:region.height});
            bone.addChild(attachment);
            attachment.regX = region.width / 2;
            attachment.regY = region.height / 2;
            that.addChild(bone);
        }
    };

    p._onFrame = function (delta) {
        this.state.update(delta * 0.001);   //spine以秒做单位
        this.state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();

        var drawOrder = this.skeleton.drawOrder;
        for (var i = 0; i < drawOrder.length; i++) {
            var slot = drawOrder[i];
            var attachment = slot.attachment;
            if(!attachment){
                continue;
            }
            var bone = slot.bone;
            var container = this.getChildByName(attachment.name);
            this.addChildAt(container, i);      //调整顺序
            if (container) {
                var sprite = container.getChildAt(0);
                container.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
                container.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
                container.scaleX = bone.worldScaleX;
                container.scaleY = bone.worldScaleY;
                container.rotation = -slot.bone.worldRotation;
                sprite.rotation = -attachment.rotation;
            }
        }
    };

// public methods:

    p.isVisible = function() {
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
    };

    min2d.Spine = Spine;
}());