Vue.component('ratingItem', {
    props: ['value', 'name'],
    template:
        '<span class="rating-item">' +
            '<label :for="elementId">{{ value }}</label>' +
            '<input type="radio" :value="value" :name="name" id="elementId" />' +
        '</span>',
    computed: {
        elementId: function () {
            return this.name + '_' + this.value;
        }
    }


});

Vue.component('rating', {
    props: {
        title: {
            type: String,
            "default": ""
        },
        max: {
            type: int,
            "default": 5
        },
        name: {
            type: String,
            "default": "rating"
        },
        buttonTitle: {
            type: String,
            "default": "Submit your score"
        }
    },
    components: ['ratingItem'],
    template:
        '<div class="rating">' +
            '<h3 class="text-center">{{ title }}</h3>' +
            '<div class="rating-items">' +
                '<rating-item v-for="n in max" :value="n" :name="name" :key="n"></rating-item>' +
            '</div>' +
            '<div class="rating-actions"><button class="btn btn-sm btn-primary">{{ buttonTitle }}</button></div>' +
        '</div>',
    data: function () {
        return {
            counter: 0
        }
    }

});