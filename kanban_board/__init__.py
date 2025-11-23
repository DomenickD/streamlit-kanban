import os
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
import os
_RELEASE = os.getenv("COMPONENT_READY", "false").lower() == "true"

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't
# want to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only* thing you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is just a
# best practice.

if not _RELEASE:
    _component_func = components.declare_component(
        "kanban_board",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run dev`.
        url="http://localhost:5173",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/dist")
    _component_func = components.declare_component("kanban_board", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the `_component_func` function
# directly to the user. But it usually makes sense to create a wrapper
# function, so that we can do argument validation, define defaults,
# and so on.

def kanban_board(columns, key=None):
    """Create a new instance of "kanban_board".

    Parameters
    ----------
    columns : list of dict
        The initial state of the columns and items.
        Example:
        [
            {"id": "todo", "title": "To Do", "items": [{"id": "1", "content": "Task 1"}]},
            {"id": "done", "title": "Done", "items": []}
        ]
    key : str or None
        An optional key that uniquely identifies this component. If this is
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    list of dict
        The current state of the columns and items, updated after drag and drop.
    """
    # Call through to our private component function. Arguments we pass here
    # will be sent to the frontend, where they'll be available in an "args"
    # dictionary.
    #
    # "default" is a special argument that specifies the initial return
    # value of the component before the user has interacted with it.
    component_value = _component_func(columns=columns, key=key, default=columns)

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    return component_value
