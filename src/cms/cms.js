import { init } from "netlify-cms-app";

init({
  config: {
    backend: {
      name: "git-gateway",
    },
    load_config_file: false,
    media_folder: "docs/images/uploads",
    public_folder: "/images/uploads",
    collections: [
      {
        label: "Posts",
        name: "posts",
        folder: "docs/posts",
        fields: [
          { name: "title", label: "Title", widget: "string" },
          {
            name: "categories",
            label: "Categories",
            widget: "categories",
            separator: "__",
          },
        ],
      },
      {
        label: "Docs",
        label_singular: "Doc",
        name: "docs",
        folder: "docs",
        create: true,
        slug: "{{menu}}{{name}}",
        identifier_field: "route",
        extension: "mdx",
        format: "frontmatter",
        fields: [
          {
            label: "Name",
            name: "name",
          },
          {
            label: "Menu",
            name: "menu",
            required: false,
          },
          {
            label: "Route",
            name: "route",
          },
          {
            label: "Body",
            name: "body",
            widget: "markdown",
          },
        ],
      },
      {
        label: "Settings",
        name: "settings",
        files: [
          {
            label: "Menu",
            name: "menu",
            file: "config/menu.json",
            fields: [
              {
                label: "Menu Items",
                name: "menuItems",
                widget: "list",
                fields: [
                  {
                    label: "Name",
                    name: "name",
                  },
                  {
                    label: "Menu",
                    name: "menu",
                    widget: "list",
                    required: false,
                  },
                ],
                default: ["Welcome"],
              },
            ],
          },
        ],
      },
    ],
  },
});



var CategoriesControl = createClass({
  handleChange: function(e) {
    const separator = this.props.field.get('separator', ', ')
    this.props.onChange(e.target.value.split(separator).map((e) => e.trim()));
  },

  render: function() {
    const separator = this.props.field.get('separator', ', ');
    var value = this.props.value;
    return h('input', {
      id: this.props.forID,
      className: this.props.classNameWrapper,
      type: 'text',
      value: value ? value.join(separator) : '',
      onChange: this.handleChange,
    });
  },
});

var CategoriesPreview = createClass({
  render: function() {
    return h('ul', {},
      this.props.value.map(function(val, index) {
        return h('li', {key: index}, val);
      })
    );
  }
});

var schema = {
  properties: {
    separator: { type: 'string' },
  },
}

CMS.registerWidget('categories', CategoriesControl, CategoriesPreview, schema);


CMS.registerEditorComponent({
  // Internal id of the component
  id: "youtube",
  // Visible label
  label: "Youtube",
  // Fields the user need to fill out when adding an instance of the component
  fields: [{name: 'id', label: 'Youtube Video ID', widget: 'string'}],
  // Pattern to identify a block as being an instance of this component
  pattern: /^youtube (\S+)$/,
  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    return {
      id: match[1]
    };
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return 'youtube ' + obj.id;
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(obj) {
    return (
      '<img src="http://img.youtube.com/vi/' + obj.id + '/maxresdefault.jpg" alt="Youtube Video"/>'
    );
  }
});
