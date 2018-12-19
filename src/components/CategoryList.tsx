import React, { useContext } from "react";
import {
  List
} from "rmwc/List";

import { AppContext } from "../contexts/App";

import ListItemContainer from "../components/styled/ListItemContainer";
import ListItemIcon from "../components/styled/ListItemIcon";

import { iconType } from "../utils/iconType";

import { Category } from "../interfaces/common";

const CategoryList= () => {

  const { state, setState } = useContext(AppContext);
  const { categories } = state;

  const toggleCategorySelected = (category: Category) => {
    category.selected = !category.selected;
    setState({ categories });
  }

  return (
    <List>
      {categories.map((item, idx) => (
        <ListItemContainer
          key={`${item.name}-${idx}`}
          onClick={() => toggleCategorySelected(item)}
          >
          <ListItemIcon selected={item.selected} icon={iconType(item.name)}/>
          {item.name}
        </ListItemContainer>
      ))}
    </List>
  );
};

export default CategoryList;
