Vue.component('ratingItem', {
    props: ['value', 'name', 'selected'],
    template:
        '<span class="rating-item">' +
            '<label :for="elementId">{{ caption }}</label>' +
            '<input type="radio" :value="value" :name="name" id="elementId" @change="update" />' +
        '</span>',
    computed: {
        elementId: function () {
            return this.name + '_' + this.value;
        },
        caption: function () {
            return this.$parent["_" + this.value];
        }
    },
    methods: {
        update: function (e) {
            this.$parent.selected = e.target.value;
        }
    }


});

Vue.component('rating', {
    props: {
        title: {
            type: String,
            "default": "Rating"
        },
        endpoint: String,
        max: {
            type: Number,
            "default": 5
        },
        name: {
            type: String,
            "default": "rating"
        },
        buttonTitle: {
            type: String,
            "default": "Submit your score"
        },
        _1: {
            type: String,
            "default": '1'
        },
        _2: {
            type: String,
            "default": '2'
        },
        _3: {
            type: String,
            "default": '3'
        },
        _4: {
            type: String,
            "default": '4'
        },
        _5: {
            type: String,
            "default": '5'
        }
    },
    components: ['ratingItem'],
    template:
        '<form class="rating" :action="endpoint" method="post" :id="formId" @submit="submit">' +
            '<h3 class="text-center">{{ title }}</h3>' +
            '<input type="hidden" name="question" :value="title" />' +
            '<div v-show="state == \'ready\'">' +
                '<div class="rating-items">' +
                    '<rating-item v-for="n in max" :value="n" :name="name" :key="n"></rating-item>' +
                '</div>' +
                '<div class="rating-actions"><button class="btn btn-sm btn-primary" :disabled=!hasChosenAnOption>{{ buttonTitle }}</button></div>' +
            '</div>' +
            '<div v-show="state == \'submitting\'" class="text-info">Submitting...</div>' +
            '<div v-show="state == \'done\'" class="text-success">✔️ Thank you for the feedback!</div>' +
            '<div v-show="state == \'error\'" class="text-warning">🙇️ Thank you for the feedback!</div>' +
        '</form>',
    data: function () {
        return {
            selected: null,
            state: 'ready'
        }
    },
    computed: {
        hasChosenAnOption: function () {
            return this.selected;
        },
        formId: function () {
            return this.name + '-form';
        }
    },
    methods: {
        submit: function (e) {
            e.preventDefault();
            this.state = 'submitting';

            var data = {
                title : this.title,
                score: this.selected,
                max: this.max
            };

            this.$http.post(this.endpoint, data, {
                emulateJSON: true
            }).then(function (response) {
                this.state = 'done';
            }, function (response) {
                this.state = 'error';
            });
        }
    }

});