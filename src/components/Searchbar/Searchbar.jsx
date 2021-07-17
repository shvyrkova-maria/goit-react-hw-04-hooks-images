import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  SearchForm,
  SearchFormButton,
  SearchInput,
} from 'components/Searchbar/Searchbar.styled';

function Searchbar({ toast, onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = event => {
    setInputValue(event.target.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      toast.error('Type a keyword to start searching images');
    }

    onSubmit(inputValue);
    formReset();
  };

  const formReset = () => {
    setInputValue('');
  };

  return (
    <Header>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit" />
        <SearchInput
          type="text"
          value={inputValue}
          onChange={handleChange}
          debounceTimeout={1000}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </Header>
  );
}

export default Searchbar;

Searchbar.propTypes = {
  toast: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
