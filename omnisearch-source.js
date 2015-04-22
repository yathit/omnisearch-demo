/**
 * @fileOverview  A reactive data source for OmniSearch.
 *
 * Progressive query search results are reactively supply to the result method, {@link #getResult}. It is consumed
 * by a template helper as reactive data. The running result can be canceled by {@link #cancel} method.
 *
 * See example usage in demo app https://github.com/yathit/omnisearch-demo
 */


OmniSearchSource = function() {
    /**
     * Target query.
     * @type {OmniSearchSource.Query}
     * @private
     */
    this.query_ = null;

    /**
     * Result.
     * @type {ReactiveVar}
     * @private
     */
    this.results_ = new ReactiveVar([]);
};


/**
 * Get query term.
 * @returns {string}
 */
OmniSearchSource.prototype.getQuery = function() {
    return this.query_ ? this.query_.query : '';
};


/**
 * Get query result.
 * @returns {Array<SearchResultItem>}
 */
OmniSearchSource.prototype.getResult = function() {
    return this.results_.get();
};


/**
 * Set query result.
 * @param results
 * @private
 */
OmniSearchSource.prototype.setResult_ = function(results) {
    this.results_.set(results);
};


/**
 * Return query process progress status.
 * @returns {number} from 0 to 1. `NaN` return if no active query.
 */
OmniSearchSource.prototype.getProgress = function() {
    var items = this.results_.get(); // make reactive dependency.
    if (this.query_ && items.length >= 0) {
        return {
            active: true,
            percent: 100 * this.query_.getProgress()
        };
    } else {
        return {
            active: false,
            percent: NaN
        };
    }
};


/**
 * Cancel query.
 */
OmniSearchSource.prototype.cancel = function() {
    if (this.query_) {
        this.query_.cancel();
        this.setResult_([]);
        this.query_ = null;
    }
};


/**
 * Search a query.
 * <pre>
 *     source.search('cat');
 * </pre>
 * To search only photos
 * <pre>
 *     source.search('cat', {photo: 'all'});
 * </pre>
 * To search only video
 * <pre>
 *     source.search('cat', {video: 'all'});
 * </pre>
 * To search a specific resource
 * <pre>
 *     source.search('cat', {video: 'youtube'});
 * </pre>
 * To search a specific resources
 * <pre>
 *     source.search('cat', [{video: 'youtube'}, {photo: 'flickr'}]);
 * </pre>
 * @param {string} query search query term.
 * @param {Option} [options] Optional options.
 */
OmniSearchSource.prototype.search = function(query, options) {
    query = query.trim();
    if (this.query_) {
        var ex_query = this.query_.query;
        if (ex_query == query) {
            return;
        }
        // clear previous query, if its result is not relevant to current query.
        var is_sub_query = query.indexOf(ex_query) >= 0;
        if (!is_sub_query) {
            this.setResult_([]);
        }
        this.query_.cancel();
    }
    this.query_ = new OmniSearchSource.Query(query, this.setResult_.bind(this), options);
};


/**
 * A query process.
 * @param {string} query
 * @param {Function} cb callback for each updated result.
 * @param {Option} [options] Optional options.
 * @constructor
 * @protected
 */
OmniSearchSource.Query = function(query, cb, options) {
    this.query = query;
    this.cb_ = cb;
    this.items_ = [];
    this.cur_step_ = 0;
    if (options) {
        if (options.video == 'all') {
            this.steps_ = OmniSearchSource.Query.video_steps;
        } if (options.photo == 'all') {
            this.steps_ = OmniSearchSource.Query.photo_steps;
        } else if (options.length) {
            his.steps_ = options;
        } else {
            this.steps_ = [options];
        }
    } else {
        this.steps_ = OmniSearchSource.Query.video_steps.concat(OmniSearchSource.Query.photo_steps,
                OmniSearchSource.Query.song_steps);
    }
    this.doQuery_();
};


OmniSearchSource.Query.video_steps = [{
    video: 'youtube'
}, {
    video: 'vimeo'
}];


OmniSearchSource.Query.photo_steps = [{
    photo: 'googleImage'
}, {
    photo: 'flickr'
}];


OmniSearchSource.Query.song_steps = [{
    song: 'spotify'
}];


/**
 * Return query process progress status.
 * @returns {number} from 0 to 1.
 */
OmniSearchSource.Query.prototype.getProgress = function() {
    return this.steps_ ? this.cur_step_ / this.steps_.length : 1;
};


OmniSearchSource.Query.prototype.setResult_ = function(items) {
    for (var i = 0; i < items.length; i++) {
        this.items_.push(items[i]);
    }
    if (this.cb_) {
        this.cb_(this.items_);
    }
};


OmniSearchSource.Query.prototype.doQuery_ = function() {
    if (this.cur_step_ >= this.steps_.length) {
        this.dispose();
    } else if (!this.cb_) {
        // result no longer interested.
    } else {
        // console.log('query: ' + this.query + ' step: ' + this.cur_step_);
        var option = this.steps_[this.cur_step_];
        var me = this;
        Meteor.call('omnisearch', this.query, option, function(err, items) {
            if (err) {
                console.error(err);
            } else {
                me.cur_step_++;
                me.setResult_(items);
                me.doQuery_();
            }
        });
    }
};


/**
 * Cancel the query process.
 */
OmniSearchSource.Query.prototype.cancel = function() {
    this.db_ = null;
};


/**
 * Dispose.
 * @protected
 */
OmniSearchSource.Query.prototype.dispose = function() {
    this.db_ = null;
    this.items_ = null;
};
