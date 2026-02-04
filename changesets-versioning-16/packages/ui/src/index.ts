import { capitalize } from '@tkssharma/utils';

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const createButton = (props: ButtonProps): string => {
  const { label, variant = 'primary' } = props;
  return `<button class="btn btn-${variant}">${capitalize(label)}</button>`;
};


export interface CardProps {
  title: string;
  content: string;
}

export const createCard = (props: CardProps): string => {
  const { title, content } = props;
  return `
    <div class="card">
      <h2>${capitalize(title)}</h2>
      <p>${content}</p>
    </div>
  `;
};
