---
layout: post
title: codeigniter Image_lib修改优化resize和crop
tags: codeigniter
categories: php
---

修改原因：Codeigniter提供有默认的图形处理类，可以很好的支持三个主流的图像库：GD/GD2, NetPBM, and ImageMagick.用到的resize修改图片大小的时候有个问题，当设置指定的width和height时，并且设置master_dim的值的时候，比如：上传的图片大小为500＊334，设置width=270,height=200,master_dim=auto,这个时候改变后的图片大小会变为270＊181，高度小于了我们设置的高度，而当设置master_dim=height的时候，上传一张宽度较小的图片可能宽度又会小于200.要实现当master_dim=auto的时候改变后的高度和宽度都不能小于我们设置的值，

解决方法:修改Image_lib.php,第1301行，添加下面代码，因为master_dim=auto的时候其实就是设置为master_dim=width所以就在其的基础上修改，

{% highlight php linenos %}
<?php
if (($this->width != $new_width) and ($this->height != $new_height)) {
            if ($this->master_dim == 'auto') {
                if ($new_height < $this->height) {
                    $this->width = $new_width;
                } else {
                    $this->height = $new_height;
                }
            } elseif ($this->master_dim == 'height') {
                $this->width = $new_width;
            } elseif ($this->master_dim == 'width') {
                $this->height = $new_height;
            }
        }
?>
{% endhighlight %}

