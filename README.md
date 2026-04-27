# Description

Built this application as a successor to my [local-notes](https://local-notes0.netlify.app/) app, where users can create notes that are stored inside the user's browser's indexed storage


The main goal was to gain hands on experience with the following

- Custom drag and drop implementation (no libraries)
- Data table implementation with sorting, in cell editing, and sorting
- Custom virtualization implementation from scratch (no libraries)
- React portal
  
The main goal of building these without using libraries or packages is to understand how those pacakges worked underneath. 
 NO AI was utilized while building features of this application (apart from generating svg icons), otherwise it would defeat the purpose.


## References:
- Indexed DB: https://www.youtube.com/watch?v=yZ26CXny3iI
- useOnClickoutside hook: https://dev.to/brdnicolas/click-outside-magic-a-new-custom-hook-4np4
- React portal: https://react.dev/reference/react-dom/createPortal
- React virtualization: Needed to go through multiple articles and videos to get a good gist of it
    - https://dev.to/mr_mornin_star/create-a-react-virtualizationwindowing-component-from-scratch-54lj
    - https://www.youtube.com/watch?v=Yz4eK-4LKXg
    - https://medium.com/ingeniouslysimple/building-a-virtualized-list-from-scratch-9225e8bec120
