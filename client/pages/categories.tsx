import { Title } from "@mantine/core";
import { useState, useEffect } from "react";
import CategoryTableSort from "../components/TableSort";
import { Category } from "../common/types";
import { appProps } from "../common/types";

export default function Categories({ backendURL, displayError }: appProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories() {
    try {
      const res = await fetch(`${backendURL}/categories`);
      if (!res.ok) {
        displayError(res.statusText);
      } else {
        const jsonObj = await res.json();
        console.log(jsonObj);
        setCategories(jsonObj);
      }
    } catch (err) {
      displayError("Unable to connect to server. Please try again later.");
    }
  }

  async function deleteCategory(category: Category) {
    try {
      const response = await fetch(
        `${backendURL}/category/${category._id}/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      if (response.ok) {
        // if request succeeded, fetch new list of categories
        fetchCategories();
      } else {
        displayError(response.statusText);
      }
    } catch (error) {
      displayError("Unable to connect to server. Please try again later.");
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Title mb={20}>All categories ({categories.length})</Title>
      <CategoryTableSort
        deleteHandler={deleteCategory}
        data={categories}
        enableSearchBar={true}
      />
    </>
  );
}
