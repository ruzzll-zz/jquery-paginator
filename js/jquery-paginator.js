(function ($){
    $.extend({
        paginator: {
            defaults: {
                perPage: 4,
                renderNumber: null,
                renderItem: null,
                pageItemSelector: '.paginator-page'
            }
        }
    });

    var Paginator = function (element, options){
        var self = this;

        self.options = $.extend({}, $.paginator.defaults, options);
        self.slider = $('.paginator-slider', element).css({
            position: 'absolute'
        });
		self.boxNumbers = $('.paginator-box-numbers', element);
        self.position = 0;
        self.mask = {
            layer: $('.paginator-mask', element)
        };

        self.mask.width = self.mask.layer.width();
        self.total = 2;

		$('.paginator-left-control', element).on('click', function(e){
			e.preventDefault();

			var tempPosition = self.position - 1;
			if(tempPosition >= 0)
				self.slide(tempPosition);
		});

		self.boxNumbers.on('click', self.options.pageItemSelector, function(e){
			e.preventDefault();

			var pagNumberItems = self.boxNumbers.children(self.options.pageItemSelector),
				tempPosition = pagNumberItems.index(this);

			if(self.total - 1 >= tempPosition)
				self.slide(tempPosition);
		});

		$('.paginator-right-control', element).on('click', function(e){
			e.preventDefault();

			var tempPosition = self.position + 1;
			if(tempPosition < self.total)
				self.slide(tempPosition);
		});
    };

    $.extend(Paginator.prototype, {
        renderData: function (data){
            var self = this;

			self.slider.add(self.boxNumbers).empty();
			self.total = Math.ceil(data.length / self.options.perPage);

			// reset pagination
            self.slider.css({
                left: 0,
                width: self.mask.width * self.total
            });

            var j = 1, list;
            $.each(data, function (i, galleryItem){
				if(i % self.options.perPage === 0){
				    if($.isFunction(self.options.renderNumber))
                        list = self.options.renderNumber.call(self, j);

					j++;
				}

                $.isFunction(self.options.renderItem) && self.options.renderItem.call(galleryItem, list);
            });
        },

        slide: function(position){
			this.position = position;

			this.slider.animate({
				left: -(this.mask.width * this.position)
			});
		}
    });
    
    $.fn.extend({
        paginator: function (options){
            return new Paginator(this, options);
        }
    });
})(jQuery);
